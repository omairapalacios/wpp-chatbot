const db = require('./config');

export const verifyIdentity = async (documento: string, to : string, from: string)=> {
  console.log(documento);
  return await db.collection('USERS')
    .where('document', '==', documento )
    .get()  
}