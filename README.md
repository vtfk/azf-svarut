# azf-svarut

Durable Azure function that sends letters to [KS SvarUT](https://svarut.ks.no/public/ks-svarut.html).

The letter schema can be found [here](https://github.com/vtfk/svarut/blob/master/src/schemas/forsendelse.json).

## API

### /api/SendLetter - Send new letter

Starts the letter orchestrator that sends the provided letter.

#### Example

**POST** ``http://localhost:7071/api/SendLetter?code=appKey``

Please send the letter as described in the [schema](https://github.com/vtfk/svarut/blob/master/src/schemas/forsendelse.json) as the request body.
Examples can be found [here](https://github.com/vtfk/svarut#sendforsendelse-simple).

Example response:

```json
{
  
}
```

### /api/status/{instanceId} - Get letter status

Gets the letters orchestrator status and SvarUt reponse.

Returns 201 if the SendLetter activity isn't finished yet, but just keep on asking for the status until we return 200 (and the status as response)

#### Example

**GET** ``http://localhost:7071/api/status/{instanceId}?code=appKey``

Example response:

```json
{

}
```

## Development


## Publish to Azure functions


## License