const currentDate = () => new Date().toISOString();

const validateEmail = (email: string) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
};


export {currentDate, validateEmail}