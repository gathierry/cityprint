# A propos de Cityprint

## Introduction

## Techniques utilisés

- HTML, CSS, Javascript
- Node.js
- MySQL

## Modèle de donnée

Il y a 3 tables dans la base de donnée : ```User```, ```City``` et ```Visit``` comme ceux qui sont montrés ci-dessous. Les clés en gras sont primaires.

|User|
|----|
|**username**|
|password|

|City|
|----|
|cityname|
|country|
|latitude|
|longitude|
|**cid** = "\<latitude>,\<longitude>"|

|Visit|
|-----|
|**username**|
|**cid**|
|time|
|impression|
|imptime|

## Resource extérieure
- Google Map API
- Google Map Geocoding API
- OpenWeatherMap API
- Openshift Plateform
- Bootstrap