### Quick.eco Sqlite Manager
Sqlite manager for Quick.eco

![QuickEco](https://nodei.co/npm/quick.eco.png)

### Example
```js
const { EconomyManager } = require('quick.eco');
const { Client } = require('discord.js');
const client = new Client();
const eco = new EconomyManager({
    adapter: 'sqlite',
    adapterOptions: {
        filename: 'data' // => data.sqlite
    }    
});
 
client.on('ready', () => console.log('connected'));
 
client.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;
 
    if(message.content === '!bal') {
        let money = eco.fetchMoney(message.author.id);
        return message.channel.send(`${message.author} has ${money} coins.`);
    }
})
```

----

> ⚠ | Windows Build Tools is required

### Windows build tools Installation
- Open a command prompt with administrator permissions
- Run 
```
npm install --global windows-build-tools --vs2015
```

----

### Adapter Options
- table - Sqlite table name
- filename - Sqlite File name
- sqliteOptions - Sqlite3 Options

----

### Links
- **[Discord Support Server](https://discord.gg/2SUybzb)**
- **[Quick.eco](https://npmjs.com/package/quick.eco)**
- **[Better-Sqlite3](https://npmjs.com/package/better-sqlite3)**

© Snowflake Studio ❄️ - 2020
