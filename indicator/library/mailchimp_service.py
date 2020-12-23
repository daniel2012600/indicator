import requests
from requests.auth import HTTPBasicAuth
import json

class MailchimpService:


    def __init__(self, mailchimp_key):
        self._mailchimp_api_url = f'''https://us{mailchimp_key.split('-us')[1]}.api.mailchimp.com/3.0'''
        self._mailchimp_key = mailchimp_key


    def get_auth(self):
        result = requests.get(self._mailchimp_api_url, auth=HTTPBasicAuth('anystring', self._mailchimp_key))
        return result


    def get_list(self):
        query = requests.get(f'{ self._mailchimp_api_url }/lists', auth=HTTPBasicAuth('anystring', self._mailchimp_key))
        return json.loads(query.text)['lists']


    def get_report_list(self, list_id):
        query = requests.get(f'{ self._mailchimp_api_url }/reports?list_id={list_id}&count=1000', auth=HTTPBasicAuth('anystring', self._mailchimp_key))

        return json.loads(query.text)['reports']


    def get_campaign_report(self, campaign_id):
        query = requests.get(f'{ self._mailchimp_api_url }/reports/{campaign_id}', auth=HTTPBasicAuth('anystring', self._mailchimp_key))

        return json.loads(query.text)


