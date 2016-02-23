# cityprint
Projet pour Mineure 6 @CentraleSupelec

## Data Model

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
|cid = **latitude+longitude**|

|Visit|
|-----|
|**username**|
|**cid**|
|time|
|impression|