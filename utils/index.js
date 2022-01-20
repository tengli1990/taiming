export const verifyPhoneNumber = (phoneNumber)=>{
  const reg = /^[1]([3-9])[0-9]{9}$/
  return reg.test(phoneNumber)
}