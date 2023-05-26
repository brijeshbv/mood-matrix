# Mood-Matrix

## Introduction

An app for daily work day sentiment analysis using GPT3.5

## Project Structure

- `matrix` directory holds app logic.
- `utils` directory holds the JSON parsers for data.
- `json_data` directory holds JSON data to be used for this demo.

The main directory holds the following files:
- `run.py` Where the Flask application is initialize and the config is loaded
- `requirements.txt` Where the dependencies this project needs to run are located.

## How to set-up

Clone the repository.
```
git clone git@github.com:brijeshbv/mood-matrix.git
```

```
# navigate to the mood-matrix directory
cd mood-matrix

# create the virtual environment for mood-matrix 
python3 -m venv mood-matrix-env

# activate the virtual environment
source mood-matrix-env/bin/activate
```

Install dependencies
```
python3 -m pip install -r requirements.txt
```

## Start the application

```
python ./run.py
```

Open your browser on http://localhost:5000

## Disclaimer 

Use at your own risk; not a supported MongoDB product
