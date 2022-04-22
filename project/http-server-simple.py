from fileinput import filename
from flask import Flask, redirect,render_template,request,jsonify, send_from_directory,url_for
import flask
from sqlalchemy import null
from werkzeug.utils import secure_filename
import json
import secrets
from flask_cors import CORS
import ast
import pymysql
import marshal
import pickle
import numpy as np
import os
import retina_blur as retina
import torch
import torch.backends.cudnn as cudnn
from pathlib import Path
import datetime
from sklearn.neural_network import MLPRegressor
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from scipy.signal import savgol_filter
from sklearn.preprocessing import StandardScaler
from sklearn import preprocessing
import base64
secret_key = secrets.token_hex(16)

UPLOAD_FOLDER = '/home/jessica/appl_RN/project/static/UploadVideo'
RESULT_FBR_FOLDER = '/home/jessica/appl_RN/project/static/ResultVideo'
ALLOWED_EXTENSIONS = {'mp4','mpg','avi'}

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = secret_key
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FBR_FOLDER'] = RESULT_FBR_FOLDER

#creating the upload folder
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)




@app.route('/')   
def home():
    return render_template('index.html')
@app.route('/blur',methods=['GET','POST'])
def face_blurring():
    if request.method == 'POST':
       file = request.files
       f = file.get('file')
       filename = secure_filename(f.filename)
       name = Path(filename).stem
       f.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
       conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
                )    
       cur = conn.cursor()
       cur.execute("INSERT INTO Blur(nomVideo) VALUES (%s)", (filename))
       conn.commit()
       conn.close()       
       if not os.path.exists(RESULT_FBR_FOLDER):
            os.makedirs(RESULT_FBR_FOLDER)
        #load face-detection model
       torch.set_grad_enabled(False)
       retina.args.cpu = 'cpu'
       net = retina.RetinaFace(phase="test")
       net = retina.load_model(net, retina.args.trained_model, retina.args.cpu)
       net.eval()
       cudnn.benchmark = True  
       device = torch.device("cpu" if retina.args.cpu else "cuda")
       net = net.to(device)
       retina.split_video(UPLOAD_FOLDER+'/'+filename,device,RESULT_FBR_FOLDER+'/'+name+'_blurred.mp4',net) 
       
       #return the video file blurred
       mp4file = RESULT_FBR_FOLDER+'/'+name+'_blurred.mp4'
       os.remove(UPLOAD_FOLDER+'/'+filename)
       with open(mp4file, "rb") as handle:
           binary_data= handle.read()
       os.remove(mp4file)
       return flask.Response(binary_data,mimetype='video/mp4')
def load_api(jsonfile):
    with open(jsonfile,'r') as file:
        _dict = json.load(file)
    return _dict
def load_model(model,X):
    X = np.array(X)
    X = X.reshape(-1,1)
    #charger le model
    model = pickle.load(open(model, 'rb'))
    y_pred = model.predict(X)
    return y_pred
@app.route('/scaling',methods=['GET', 'POST'])
def scale():
    if request.method=='POST' and request.data:
        data = request.data
        data = data.decode(encoding='utf-8')
        data = ast.literal_eval(data)
        data_path = './json/Fusion.json'
        DATA = load_api(data_path)
        if data['vue'] == 'Face':
            vue = 'f'
        elif data['vue'] == 'Profile':
            vue = 'p'
        else:
            vue = 'd'
        for i in range(3):
            to_scale = []
            video_name = 'Sujet'+str(data['topic_number'])+'_'+str(i+1)+vue+'.mp4'
            date = datetime.datetime.now()
            date = date.strftime("%d/%B/%Y ")
            if video_name in DATA.keys():
                conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
                )
                cur = conn.cursor()
               
                
                if cur.execute("SELECT * FROM Datas WHERE topic_name=%s",video_name):
                    topic = cur.fetchone()
                    conn.close()
                    output = str(marshal.loads(topic[3]))
                   
                else:
                   
                    #le nom du model
                    model_path = './model/model_'+data['vue']+'_'+data['angle_name']+'.pkl'
                    print(model_path)
                    tempo = DATA[video_name]
                    for item in tempo:
                        for key in item.keys():
                            to_scale.append(item[key][data['angle_name']])
                    #chargement du model
                    pred = load_model(model_path,to_scale)
                    pred = pred.tolist()
                    binaryData =marshal.dumps(pred)
                    cur = conn.cursor()
                    cur.execute("INSERT INTO Datas(topic_name,angle_name,file_correction,dates) VALUES (%s,%s,%s,%s)", (video_name,data['angle_name'],binaryData,date))
                    conn.commit()
                    conn.close()
                    output = (marshal.loads(binaryData))#à utiliser pour convertir les blobs data en son type initial 
                    
                return jsonify(output)
            else:     
                return jsonify('This topic is not available'), 203
            
    else:
        return render_template('index.html')
@app.route('/dashboard')
def dashboard():
    conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
                )
    cur = conn.cursor()
    cur.execute('SELECT * FROM Datas')
    liste = cur.fetchall()
    new_liste = []
    conn.close()
    for item in liste:
        output  = str(marshal.loads(item[3])) 
        new_liste.append([item[0],item[1],item[2],output,item[4]])    
    return jsonify(new_liste)
def rectify_list(liste):
    for x in range(len(liste)-1):
        #liste[x] = liste[x].strip()
        liste[x] = float(liste[x])
    liste[len(liste)-1] = float(liste[len(liste)-1][:-1]) # pour enlever le ; du dernier element de la liste
    
    liste = np.array(liste)
    return liste
def MLPR(X,Y,model_name,architecture):
    X = X.reshape(-1,1)
    #lissage par Savitzky-Golay ou savgol
    np.set_printoptions(precision=2)
    X = savgol_filter(X, 7, 2, mode='nearest')
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y,test_size=0.2,random_state=0)
    regr = MLPRegressor(hidden_layer_sizes=architecture,random_state = 1,max_iter=400000).fit(X_train,Y_train)
    score_train = regr.score(X_train, Y_train)
    score_test = regr.score(X_test,Y_test)
    print(score_train)
    print(score_test)
    #save model
    filename = model_name+'.pkl'
    pickle.dump(regr, open(filename,'wb'))
    return filename,score_train
@app.route('/build',methods=['GET', 'POST'])
def build_model():
    if request.method == 'POST':
       data = request.data
       data = data.decode(encoding='utf-8')
       data = eval(data)

       #rectify datas
       X=(data[0].split(';\n'))
       del X[len(X)-1]
       
       Y=(data[1].split(';\n'))
       del Y[len(Y)-1]
       model_name = data[2]
       architecture =tuple(data[3])
       X = rectify_list(X)
       Y = rectify_list(Y)
      
       filename,score = MLPR(X,Y,model_name,architecture)
       with open(filename,'rb') as f:
           blob = base64.b64encode(f.read())
    
       #save
       conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
                )
       cur = conn.cursor()
       cur.execute("INSERT INTO Model(model_name,model,score_train,architecture) VALUES(%s,%s,%s,%s)",(filename,blob,score,str(architecture)))
       conn.commit()
       cur.execute('SELECT LAST_INSERT_ID()')
       last_id =cur.fetchone()
       conn.close()
    os.remove(filename)
    blob = blob.decode('utf-8')
    return jsonify(score,filename,blob,last_id[0])
'''forme de l identification personnalisé: filename+id_000+id_model'''
@app.route('/use_model',methods=['GET', 'POST'])
def use_model():
    data = request.data
    data = data.decode(encoding='utf-8')
    data = eval(data)
    
    X=(data[0].split(';\n'))
    X = rectify_list(X)
    X = X.reshape(-1,1)
    conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
    )
    cur = conn.cursor()
                        
    cur.execute("SELECT model FROM Model WHERE model_name=%s",data[2])
    model = cur.fetchone()
    conn.close()
    model_byte = model[0]
    
    model = base64.b64decode(model_byte)
    #réecrire le model dans le disque du serveur
    with open(data[2], 'wb') as file:
        file.write(model)
    #load model
    m = pickle.load(open(data[2],'rb'))
    y_predict = m.predict(X)
   
    os.remove(data[2])
   
    return jsonify(list(y_predict))
@app.route('/train',methods=['GET', 'POST'])
def train():
    data = request.data
    data = data.decode(encoding='utf-8')
    data = eval(data)
    if null in data:
        return jsonify("Can't provide an empty set"),302
    X=(data[0].split(';\n'))
    del X[len(X)-1]
    
    Y=(data[1].split(';\n'))
    del Y[len(Y)-1]
    model_id = data[2]
    if '.pkl_Id__00' not in model_id:
        return jsonify("Verify your model identification!"),302
    else:
        model_name = model_id.split('_Id__00')[0]
    
        model_id = model_id.split('_Id__00')[1]
        X = rectify_list(X).reshape(-1,1)
        Y = rectify_list(Y)
    


    conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "ergodev2022*/",
                        db='MYDB',
    )
    cur = conn.cursor()
                        
    cur.execute("SELECT model,score_train FROM Model WHERE id_model=%s AND model_name=%s",(model_id,model_name))
    model = cur.fetchone()
    if model == None:
        return jsonify("This model doesn't exist!"),302
    else:
        model_byte = model[0]
        score = model[1] #le score du model
        model = base64.b64decode(model_byte)
        #réecrire le model dans le disque du serveur
        with open(data[2], 'wb') as file:
            file.write(model)
        #load model
        m = pickle.load(open(data[2],'rb'))
        #re-train model
        m = m.fit(X,Y)
        new_score = m.score(X,Y)
        print(score , new_score)
        os.remove(data[2])
        #reecrire le nouveau model
        pickle.dump(m, open(model_name,'wb'))
        #convert to blob type
        with open(model_name,'rb') as f:
            blob = base64.b64encode(f.read())
        #delete model in the server file storage
        os.remove(model_name)
        #update column model in database
   
        cur.execute("UPDATE Model SET model=%s WHERE id_model =%s",(blob,model_id))
        conn.commit()
        conn.close()
        return jsonify('train accomplished with successfull',new_score,score)
@app.errorhandler(404)
def page_not_found(error):
    return 'This page does not exist', 404

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
