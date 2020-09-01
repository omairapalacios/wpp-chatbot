import { User } from "../interfaces/user"

const db = require('./config');

let link : string;
let user : User = { 
    document:'',
    name: '',
    lastname: '',
    cellphone: '',
    email:'',
    status: 'inactivo'
  }

export const verifyIdentity = async (document: string) => { 
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
      });
    }
    return user;
  }
  catch(error) {
    throw Error(error);
  }
}

export const getBoletaByPeriod = async (month: string, document: string) => { 
  console.log('month',month);
  console.log('document',document);
  const year = new Date().getFullYear()
  const id = `${month}${year}${document}`
  console.log('id boleta', id);
  
  try {
    link= '';
    const boleta = await db.collection('BOLETAS').doc(id)
    .get()
    console.log('boleta', boleta);
    if (boleta.exists) {
      link = boleta.data().link_boleta;
      console.log('link',link);
      return link;
    } 
    else {
      return link;
    } 
  }
    catch(error) {
      throw Error(error);
    }
  }