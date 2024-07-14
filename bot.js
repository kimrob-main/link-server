const axios = require('axios');

const token = '7206781066:AAFQb951wVIqbPuCtxUK2-jm_1oUc3E8pB0';

axios.get(`https://api.telegram.org/bot${token}/getUpdates`)
  .then(response => {
    const updates = response.data.result;
    updates.forEach(update => {
      if (update.message && update.message.chat) {
        console.log('Chat ID:', update.message.chat.id);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching updates:', error);
  });
