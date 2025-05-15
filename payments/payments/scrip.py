
import requests
import json
import time
for _ in range(1000):
    for _ in range(20):
        url = "http://127.0.0.1:8000/api/payments/create-checkout-session/"

        payload = json.dumps({
        "product_name": "shirt",
        "amount": 12345,
        "order_ids": [
            40
        ]
        })
        headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMDYxMTExLCJpYXQiOjE3NDI5NzQ3MTEsImp0aSI6Ijg5ZTE2NzNhMzM3YTQ3OTVhNWY2NzYxZjA5MzczNGYyIiwidXNlcl9pZCI6M30.t7I5tctKYnmpqQE17HjoCaABSAPtSEkGMzTp8xAVNcg',
        'Cookie': 'csrftoken=PcFqnpxpHyHyU6neUJC3ttzZ9ojbQudR'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        print(response.text)
    time.sleep(0.1)
