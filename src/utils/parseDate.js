const parseDate = (dateStr) => {
    const meses = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12",
    };
  
    const match = dateStr.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
    if (!match) return new Date(0);
  
    const day = match[1].padStart(2, "0");
    const month = meses[match[2].toLowerCase()];
    const year = match[3];
  
    return new Date(`${year}-${month}-${day}`);
  };
  
  export default parseDate;
  