const date = new Date().toISOString();
console.log(date.split('T')[0].split("-").reverse().join('-'));