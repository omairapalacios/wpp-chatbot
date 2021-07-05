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

export async function verifyIdentity(document: string){ 
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

export async function getBoletaByPeriod(month: string, document: string) { 
  const year = new Date().getFullYear()
  const id = `${month}${year}${document}`
  try {
    link= '';
    const boleta = await db.collection('BOLETAS').doc(id)
    .get()
    if (boleta.exists) {
      link = boleta.data().link_boleta;
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