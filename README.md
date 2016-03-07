# Schools Database API

A Restful api of schools and districts

### Requirements

* nodejs 0.8.x
* mysql 5.x


### Installation

*  Import the [schools mysql database](https://bitbucket.org/tumis/utqi-eddata)


* Install the required node modules

```
$ sudo npm install
$ DEBUG=express:* node app

```

* Browse to [http://localhost:8080/schools](http://localhost:8080/schools)


### Endpoints

```
/schools
/school/:id

/districts
/district/:id
```


## Open Source License

Code is released under the MIT public license.
