const PUBLIC_DIR = '~/dist/browser';
const express = require('express');
const extName = require('ext-name');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function handleIncomingSMS(req, res) {
    console.log("Received SMS");
    const { body } = req;
    const { NumMedia, From: SenderNumber, MessageSid } = body;
    let saveOperations = [];
    const mediaItems = [];
  
    for (var i = 0; i < NumMedia; i++) {  // eslint-disable-line
      const mediaUrl = body[`MediaUrl${i}`];
      const contentType = body[`MediaContentType${i}`];
      const extension = extName.mime(contentType)[0].ext;
      const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
      const filename = `${mediaSid}.${extension}`;
  
      mediaItems.push({ mediaSid, MessageSid, mediaUrl, filename, extension });
      saveOperations = mediaItems.map(mediaItem => SaveMedia(mediaItem));
    }
  
    await Promise.all(saveOperations);
  
    const messageBody = NumMedia === 0 ?
    'Send us an image!' :
    `Thanks for sending us ${NumMedia} file(s)`;
  
    // const response = new MessagingResponse();
    // response.message({
    //   from: twilioPhoneNumber,
    //   to: SenderNumber,
    // }, messageBody);
  
    return;// res.send(response.toString()).status(200);
  }
  
  async function SaveMedia(mediaItem) {
    const { mediaUrl, filename } = mediaItem;
    if (NODE_ENV !== 'test') {
      const fullPath = path.resolve(`${PUBLIC_DIR}/menu.${extension}`);
  
     
        const response = await fetch(mediaUrl);
        const fileStream = fs.createWriteStream(fullPath);
  
        response.body.pipe(fileStream);
      
  
    }
  }
  
  const router = express.Router();
  router.post('/incoming', handleIncomingSMS);

  module.exports = router;