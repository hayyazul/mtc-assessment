from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime
import httpx
import os

load_dotenv()

# Two env variables, whether to use the hardcoded JSON or the actual API.
app = FastAPI()
API_KEY = os.getenv('ISLAMIC_API_KEY')
USE_REAL_API = os.getenv('USE_REAL_API')
HARDCODED_JSON = {'code': 999, 'status': 'success', 'range': 'ramadan', 'ramadan_year': 1447, 'data': {'fasting': [{'date': '2026-02-18', 'day': 'Wednesday', 'hijri': '1447-09-01', 'hijri_readable': '1 Ramadan 1447 AH', 'time': {'sahur': '04:56', 'iftar': '18:06', 'duration': '13 hours 10 minutes'}}, {'date': '2026-02-19', 'day': 'Thursday', 'hijri': '1447-09-02', 'hijri_readable': '2 Ramadan 1447 AH', 'time': {'sahur': '04:56', 'iftar': '18:06', 'duration': '13 hours 10 minutes'}}, {'date': '2026-02-20', 'day': 'Friday', 'hijri': '1447-09-03', 'hijri_readable': '3 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-21', 'day': 'Saturday', 'hijri': '1447-09-04', 'hijri_readable': '4 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-22', 'day': 'Sunday', 'hijri': '1447-09-05', 'hijri_readable': '5 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-23', 'day': 'Monday', 'hijri': '1447-09-06', 'hijri_readable': '6 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-24', 'day': 'Tuesday', 'hijri': '1447-09-07', 'hijri_readable': '7 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-25', 'day': 'Wednesday', 'hijri': '1447-09-08', 'hijri_readable': '8 Ramadan 1447 AH', 'time': {'sahur': '04:55', 'iftar': '18:06', 'duration': '13 hours 11 minutes'}}, {'date': '2026-02-26', 'day': 'Thursday', 'hijri': '1447-09-09', 'hijri_readable': '9 Ramadan 1447 AH', 'time': {'sahur': '04:54', 'iftar': '18:06', 'duration': '13 hours 12 minutes'}}, {'date': '2026-02-27', 'day': 'Friday', 'hijri': '1447-09-10', 'hijri_readable': '10 Ramadan 1447 AH', 'time': {'sahur': '04:54', 'iftar': '18:06', 'duration': '13 hours 12 minutes'}}, {'date': '2026-02-28', 'day': 'Saturday', 'hijri': '1447-09-11', 'hijri_readable': '11 Ramadan 1447 AH', 'time': {'sahur': '04:54', 'iftar': '18:06', 'duration': '13 hours 12 minutes'}}, {'date': '2026-03-01', 'day': 'Sunday', 'hijri': '1447-09-12', 'hijri_readable': '12 Ramadan 1447 AH', 'time': {'sahur': '04:54', 'iftar': '18:06', 'duration': '13 hours 12 minutes'}}, {'date': '2026-03-02', 'day': 'Monday', 'hijri': '1447-09-13', 'hijri_readable': '13 Ramadan 1447 AH', 'time': {'sahur': '04:54', 'iftar': '18:05', 'duration': '13 hours 11 minutes'}}, {'date': '2026-03-03', 'day': 'Tuesday', 'hijri': '1447-09-14', 'hijri_readable': '14 Ramadan 1447 AH', 'time': {'sahur': '04:53', 'iftar': '18:05', 'duration': '13 hours 12 minutes'}}, {'date': '2026-03-04', 'day': 'Wednesday', 'hijri': '1447-09-15', 'hijri_readable': '15 Ramadan 1447 AH', 'time': {'sahur': '04:53', 'iftar': '18:05', 'duration': '13 hours 12 minutes'}}, {'date': '2026-03-05', 'day': 'Thursday', 'hijri': '1447-09-16', 'hijri_readable': '16 Ramadan 1447 AH', 'time': {'sahur': '04:53', 'iftar': '18:05', 'duration': '13 hours 12 minutes'}}, {'date': '2026-03-06', 'day': 'Friday', 'hijri': '1447-09-17', 'hijri_readable': '17 Ramadan 1447 AH', 'time': {'sahur': '04:52', 'iftar': '18:05', 'duration': '13 hours 13 minutes'}}, {'date': '2026-03-07', 'day': 'Saturday', 'hijri': '1447-09-18', 'hijri_readable': '18 Ramadan 1447 AH', 'time': {'sahur': '04:52', 'iftar': '18:05', 'duration': '13 hours 13 minutes'}}, {'date': '2026-03-08', 'day': 'Sunday', 'hijri': '1447-09-19', 'hijri_readable': '19 Ramadan 1447 AH', 'time': {'sahur': '04:52', 'iftar': '18:05', 'duration': '13 hours 13 minutes'}}, {'date': '2026-03-09', 'day': 'Monday', 'hijri': '1447-09-20', 'hijri_readable': '20 Ramadan 1447 AH', 'time': {'sahur': '04:51', 'iftar': '18:05', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-10', 'day': 'Tuesday', 'hijri': '1447-09-21', 'hijri_readable': '21 Ramadan 1447 AH', 'time': {'sahur': '04:51', 'iftar': '18:04', 'duration': '13 hours 13 minutes'}}, {'date': '2026-03-11', 'day': 'Wednesday', 'hijri': '1447-09-22', 'hijri_readable': '22 Ramadan 1447 AH', 'time': {'sahur': '04:51', 'iftar': '18:04', 'duration': '13 hours 13 minutes'}}, {'date': '2026-03-12', 'day': 'Thursday', 'hijri': '1447-09-23', 'hijri_readable': '23 Ramadan 1447 AH', 'time': {'sahur': '04:50', 'iftar': '18:04', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-13', 'day': 'Friday', 'hijri': '1447-09-24', 'hijri_readable': '24 Ramadan 1447 AH', 'time': {'sahur': '04:50', 'iftar': '18:04', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-14', 'day': 'Saturday', 'hijri': '1447-09-25', 'hijri_readable': '25 Ramadan 1447 AH', 'time': {'sahur': '04:50', 'iftar': '18:04', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-15', 'day': 'Sunday', 'hijri': '1447-09-26', 'hijri_readable': '26 Ramadan 1447 AH', 'time': {'sahur': '04:49', 'iftar': '18:04', 'duration': '13 hours 15 minutes'}}, {'date': '2026-03-16', 'day': 'Monday', 'hijri': '1447-09-27', 'hijri_readable': '27 Ramadan 1447 AH', 'time': {'sahur': '04:49', 'iftar': '18:03', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-17', 'day': 'Tuesday', 'hijri': '1447-09-28', 'hijri_readable': '28 Ramadan 1447 AH', 'time': {'sahur': '04:49', 'iftar': '18:03', 'duration': '13 hours 14 minutes'}}, {'date': '2026-03-18', 'day': 'Wednesday', 'hijri': '1447-09-29', 'hijri_readable': '29 Ramadan 1447 AH', 'time': {'sahur': '04:48', 'iftar': '18:03', 'duration': '13 hours 15 minutes'}}, {'date': '2026-03-19', 'day': 'Thursday', 'hijri': '1447-09-30', 'hijri_readable': '30 Ramadan 1447 AH', 'time': {'sahur': '04:48', 'iftar': '18:03', 'duration': '13 hours 15 minutes'}}], 'white_days': {'status': 'will_observe', 'days': {'13th': '2026-03-02', '14th': '2026-03-03', '15th': '2026-03-04'}}}, 'resource': {'dua': {'title': 'Day 3 – Dua for Breaking Fast', 'arabic': 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ', 'translation': 'Thirst is gone, the veins are moistened, and the reward is certain if Allah wills.', 'transliteration': "Dhahaba al-zama wa'btalat al-'uruq wa thabata al-ajr in sha Allah", 'reference': 'Abu Dawud: 2357'}, 'hadith': {'arabic': 'أَفْضَلُ الصِّيَامِ بَعْدَ شَهْرِ رَمَضَانَ صِيَامُ شَهْرِ اللَّهِ الْمُحَرَّمِ', 'english': 'The best fast after the month of Ramadan is fasting in the month of Allah, al-Muharram.', 'source': 'Ṣaḥīḥ Muslim 1163', 'grade': 'Sahih'}}}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if USE_REAL_API:
    print('Real API being used.')

@app.get("/")
async def root():
    return {}

@app.get("/ramadan")
async def ramadan(lat: float, lon: float):
    if USE_REAL_API:
        if not API_KEY:
            raise HTTPException(status_code=500, detail="ISLAMIC_API_KEY is not set")
        try:
            response = httpx.get(
                f'https://islamicapi.com/api/v1/ramadan/',
                params={'lat': lat, 'lon': lon, 'api_key': API_KEY},
                timeout=2.0
            )
            response.raise_for_status() 
            ramadan_json = response.json()
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Islamic API timed out")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Islamic API returned {e.response.status_code}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Failed to reach Islamic API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    else:
        ramadan_json = HARDCODED_JSON
    try:
        fasting_data = ramadan_json['data']['fasting']
        return [
            {'date': day['date'], 'sahur': day['time']['sahur'], 'iftar': day['time']['iftar']}
            for day in fasting_data
        ]
    except (KeyError, TypeError) as e:
        raise HTTPException(status_code=500, detail=f"Unexpected API response shape: {str(e)}")