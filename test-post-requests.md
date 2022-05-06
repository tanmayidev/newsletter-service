# API END POINTS - POST REQUESTS

### This is a file which contains set of post requests to test the api end points


## Post Requests are made in following order:

### 1. POST /register
`http://localhost:1337/register`
```
{
	"admin_name":"admin1",
	"email":"admin1@email.com",
	"title":"newsletter1"
}
```

### 2. POST /add-topics
`http://localhost:1337/add-topics`
```
{
	"email":"admin1@email.com",
	"name":"cyber"
}
```

```
{
	"email":"admin1@email.com",
	"name":"blockchain"
}
```

```
{
	"email":"admin1@email.com",
	"name":"networks"
}
```

```
{
	"email":"admin1@email.com",
	"name":"dbms"	
}
```

### 3. POST /add-content
`http://localhost:1337/add-content`

**Note :**    
  * publish_time should be of the format **"YYYY,MM,DD,hh,MM,SS"**
  * month is 0 indexed => (January=0, February=1, ........., December=11)
  * Example : **6th May, 2022 @ 6:30 pm would be 2022,04,06,06,30,00**

```
{
    "publish_time":"2022,04,06,06,45,00",
    "content_data":"article 1 content: Cyber",
    "topic_id":1,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,47,00",
    "content_data":"article 2 content: Cyber",
    "topic_id":1,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,45,00",
    "content_data":"article 1 content: Blockchain",
    "topic_id":2,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,40,00",
    "content_data":"article 1 content: Networks",
    "topic_id":3,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,42,00",
    "content_data":"article 2 content: Networks",
    "topic_id":3,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,44,00",
    "content_data":"article 3 content: Networks",
    "topic_id":3,
    "email":"admin1@email.com"
}
```

```
{
    "publish_time":"2022,04,06,06,40,00",
    "content_data":"article 1 content: DBMS",
    "topic_id":4,
    "email":"admin1@email.com"
}
```

### 4. POST /:newsletter/subscribe

`http://localhost:1337/newsletter1/subscribe`

**Note:**    
* Temporary email ids were generated and used for testing

```
{
	"sub_email":"figiji2519@eoscast.com",
	"topic":"cyber"
}
```

```
{
	"sub_email":"tinag71878@bunlets.com",
	"topic":"dbms"
}
```

```
{
	"sub_email":"mirid38454@abincol.com",
	"topic":"blockchain"
}
```

```
{
	"sub_email":"jifet47492@angeleslid.com",
	"topic":"networks"
}
```
