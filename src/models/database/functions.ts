import { User } from "../interfaces/user"

const db = require('./config');

export const verifyIdentity = async (document: string) => { 
let user : User = { 
  document:'',
  name: '',
  lastname: '',
  cellphone: '',
  email:'',
  status: 'inactivo'}
  try {
    const query =  await db.collection('USERS')
    .where('document', '==', document )
    .get()  

    if(query.docs.length > 0) {
      query.forEach((doc: any) =>  {
        user = {
          ...doc.data(),
          status: 'activo'
        } 
        console.log('USER',user);
        return user;
      });
    }
    return user;
  }
  catch(error) {
    throw Error(error);
  }
}
