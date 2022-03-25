
from flask import Flask, redirect,render_template,request,jsonify, send_from_directory,url_for
import flask
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
                        password = "password",
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
    if request.method=='POST':
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
                        password = "password",
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
                    output = str(marshal.loads(binaryData))#à utiliser pour convertir les blobs data en son type initial 
                    
                return jsonify(output)
            else:     
                return 'This topic is not available', 401
            
    else:
        return render_template('index.html')
@app.route('/dashboard')
def dashboard():
    conn = pymysql.connect(
                        host='localhost',
                        user='root', 
                        password = "password",
                        db='MYDB',
                )
    cur = conn.cursor()
    cur.execute('SELECT topic_name,angle_name,dates FROM Datas')
    liste = cur.fetchall()
    print(liste)
    conn.close()         
    return jsonify(liste)     
        
@app.errorhandler(404)
def page_not_found(error):
    return 'This page does not exist', 404

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
