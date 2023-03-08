from flask import Flask, request, Response
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
app = Flask(__name__)
CORS(app)



@app.route('/getRangeData', methods=['POST'])
def uploadImage():

    print('Hello')

    inst_df = pd.read_csv('../data/gen_data3.csv')

    print(request.form['start_time'])
    # data = json.loads(request.data)
    # print(data)
    data = request.form
    start_time = data['start_time']
    end_time = data['end_time']
    print(start_time)
    print(end_time)
    try:
        start_time = float(start_time)
        end_time = float(end_time)
    except Exception as e:
        print(e)
        # return Response("{'a':'b'}", status=201, mimetype='application/json')
        return json.dumps({'msg':'Invalid Input!!'}), 400, {'ContentType':'application/json'}
    print('no error')
    inst_df = inst_df[ (inst_df['time']>=start_time) &  (inst_df['time']<= end_time) ]
    # inst_df.to_csv('../data/selected_instances.csv')

    instances_series = inst_df['inst_id'].value_counts()
    unique_instances = pd.DataFrame({'inst_id':instances_series.index})
    # pd.DataFrame({'inst_id':instances_series.index}).to_csv('../data/selected_inst_list.csv', index=False)
    resp = {
                'mesg':'Success',
                'data':{
                    'selected_time_data':inst_df.to_json(orient='records'),
                    'instances_list':unique_instances.to_json(orient='records')
                }
            }
    return json.dumps(resp), 200, {'ContentType':'application/json'}
    # response = flask.jsonify({'some': 'data'})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

# @app.route('/getInstanceData', methods=['POST'])
# def getInstanceData():

if __name__=='__main__':
    app.run(threaded=True, debug=True, port = 8080, host='0.0.0.0')
