import json

def  fusionner(list_sujet):
    File = {}
    for item in list_sujet:
        liste = []
        with open('Sujet'+str(item)+'_1p_success.json') as file:
            fl = json.load(file)
            key = fl['_id']
            _dict_ = fl['frames']
            for K in _dict_.keys():
                temp = {}
                temp[K] = _dict_[K]['angles']
                liste.append(temp)
        File[key] = liste
    with open('Fusion.json','w') as outfile:
        json.dump(File,outfile,indent=4)
if __name__ == '__main__':
    fusionner([1,4,5,6,7,9,10,11,12,13,14,15,18,21,22])