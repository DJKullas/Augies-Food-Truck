const PUBLIC_DIR = 'dist/browser';
const express = require('express');
const extName = require('ext-name');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const urlUtil = require('url');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('dotenv').config()

var serviceAccount = JSON.parse(process.env.GOOGLE_CREDS)

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function handleIncomingSMS(req, res) {
    console.log("Received SMS");
    const { body } = req;
    const { NumMedia, From: SenderNumber, MessageSid } = body;
    let saveOperations = [];
    const mediaItems = [];
  
    for (var i = 0; i < NumMedia; i++) {  // eslint-disable-line
      const mediaUrl = body[`MediaUrl${i}`];
      const contentType = body[`MediaContentType${i}`];
      var test = extName.mime(contentType);
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
    const { mediaUrl, filename, extension } = mediaItem;
    if ('prod' !== 'test') {
    //   const fullPath = path.resolve(`src/assets/images/menu.${extension}`);
  
     
    //     const response = await fetch(mediaUrl);
    //     const fileStream = fs.createWriteStream(fullPath);
  

        db.doc('menu_url/menu_url').set({ mediaUrl: mediaUrl });

        //response.body.pipe(fileStream);
      
  
    }
  }
  
  const router = express.Router();
  router.post('/incoming', handleIncomingSMS);

  module.exports = router;