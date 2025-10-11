import bcrypt from 'bcryptjs'


export const comparePassword = (password,hash)=>{
    const result =  bcrypt.compareSync(password,hash);
    console.log("PASSWORD : ",result)
    return result
}

export const hashPassword = (password)=>{
    const result = bcrypt.hashSync(password,12)
    console.log("Hashed password : ",result)
    return result ;
}
