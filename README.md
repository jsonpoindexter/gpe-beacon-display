# gpe-beacon-display
A web interface that that is used to recieve data from a custom made Lora/GPS/Compass beacon and display it on an interactive offline map of the Black Rock City. This app also displays beacon information such as ID, Heading, and Last Reported times, as well as allows users to assign a Driver and Rider name to each beacon.

## Requirement(s): 
* Redis: https://habilisbest.com/install-redis-on-your-raspberrypi

## Install
`pip install -r requirements.txt`

## Run 
`python server.py`

## Testing 
To simulate GPS data into Redis: `python test/simulate_beacon.py`
