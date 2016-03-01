# A propos de Cityprint

## Introduction

Cityprint est une web application qui on permet de noter les villes que l'on a visitées. Après s'est connecté, l'applications peut détecter la coordonnée d'utilisateur et la sauvegarder automatiquement dans le serveur. Avec Cityprint, on peut voir nos parcours dans le monde et on est encouragé à explorer le territoire inconnu.

Cityprint fournit aussi les informations pratiques telles que l'introduction et la météo de la location d'utilisateur. De plus, on peut partager nos impressions des villes.

## Diagrammes de séquences

Cette application peut être séparée en 3 parties : client, serveur et base de donnée.

## Techniques utilisés

- HTML, CSS, Javascript, JQuery, AJAX, JSON
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

## Web pages



## Routière de serveur

### GET

- '/' : la page principale qui contient une carte et l'information de ville.
- '/login' : la page pour se connecter
- '/logout' : déconnecter
- '/visit' : interface d'ajax, noter la location actuelle en renvoyer les informations corrélées
- '/checkusername' : interface d'ajax, examiner si le nom d'utilisateur est déjà dans la base de donnée
- '/about' : cette page

### POST

- '/reg' : registrer nouveau utilisateur
- '/login' : se connecter
- '/impression' : commenter en une ville

## Ressources extérieures

Cityprint est enforci par les ressource extérieures. 

La carte est fournie par Google Map et les informations de ville sont alimentées par Google Map Geocoding et Wikipedia. La météo vient d'OpenWeatherMap. Bootstrap, un magnifique cadre de front-end nous donne les composants jolies et intéressantes. PaaS de Openshift nous permet de déployer l'application en ligne.

- Google Map
- Google Map Geocoding API
- OpenWeatherMap API
- Wikipedia API
- Openshift Plateform
- Bootstrap