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
    const monthFirstMatch = dateStr.match(/(\w+)\s+(\d{1,2})\s+de\s+(\d{4})/i);
    if (!match && !monthFirstMatch) return new Date(0);
  
    const day = (match ? match[1] : monthFirstMatch[2]).padStart(2, "0");
    const monthName = match ? match[2] : monthFirstMatch[1];
    const month = meses[monthName.toLowerCase()];
    const year = match ? match[3] : monthFirstMatch[3];
    if (!month) return new Date(0);
  
    return new Date(`${year}-${month}-${day}`);
  };
  
  export default parseDate;
  
