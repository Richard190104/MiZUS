var button = document.createElement("button");
button.classList.add("mainButtons");
button.innerHTML = "Export";

function calculateDuration(start, end) {
   const [hoursStart, minutesStart] = start.split(":").map(Number);
   const [hoursEnd, minutesEnd] = end.split(":").map(Number);

   const startTotalMinutes = hoursStart * 60 + minutesStart;
   const endTotalMinutes = hoursEnd * 60 + minutesEnd;

   let durationMinutes = endTotalMinutes - startTotalMinutes;

   if (durationMinutes < 0) {
       durationMinutes += 24 * 60; 
   }

   const durationHours = Math.floor(durationMinutes / 60);
   const remainingMinutes = durationMinutes % 60;

   return `${durationHours}h ${remainingMinutes}m`;
}

function getDayFromDate(dateString) {
   const date = new Date(dateString); 
   const days = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
   return days[date.getDay()]; 
}

function getBorders(){
   cm = currentMonth+1
   var w = [];

   for(var i = 1; i < 32; i++){
      let day = getDayFromDate("2025-" + cm + "-" + i);
      if (day == "Nedeľa"){
         w.push(i)
      }
      
   }
   return w;
}

function prepareData(mh){
   let week1 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let week2 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let week3 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let week4 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let week5 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let week6 = [ ["", "Deň", "Dátum", "Meno študenta", "Čas", "Trvanie lekcie", ""] ]
   let weeks = [week1,week2,week3,week4,week5,week6];
   let breaks = getBorders();
   
   var currentWeek = 0;
   for (var i = 1; i < 32; i++){
      if (breaks.includes(i)){
         currentWeek = breaks.indexOf(i) + 1;
      }
      if(mh[i]){
         let lessons = mh[i]
         lessons.forEach((lesson) => {
            if(lesson.name != undefined){
               var c = "";
               try{
                  if (lesson.r == "on"){
                     c = "náhradná hodina"
                  }
                  else{
                     c = "";
                  }
               }catch(e){}
               weeks[currentWeek].push(["",getDayFromDate("2025-" + (currentMonth+1) + "-" + i), i + "/" + (currentMonth+1) + "/2025",lesson.name,lesson.start,calculateDuration(lesson.start,lesson.end), c])
            }
          
         })
         
      }
      
   }
   weeks.forEach((week) => {
      while(week.length < 6){
            week.push(["","","","","",""]);
         
      }
   });
   return weeks;

}

(async () => {
    const dataArray = await LoadHistory();
    button.addEventListener("click", () => {
      var cd = prepareData(dataArray[currentMonth])
      exportToExcel(cd)
 });
  })();

  document.querySelector(".section").appendChild(button)



async function exportToExcel(datas) {
   var lastDay = "";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Výpis");


    pointer = 0;

   for (var i = 0; i < datas.length; i++){
      let data = datas[i]; 
      let lastDay = ""; 
      
      data.forEach((row) => {
          let newRow = worksheet.addRow(row); 
          let rowIndex = newRow.number; 
          
          let cellValue = worksheet.getRow(rowIndex).getCell(2).value; 
          
          if (cellValue && cellValue !== "Deň") {
              if (cellValue === lastDay) {
                  worksheet.getRow(rowIndex).getCell(2).value = ""; 
              } else {
                  lastDay = cellValue; 
              }
          }
      });
      
    var headerRow = worksheet.getRow(pointer+1);

    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF000000" } }; 
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9D9D9" }, 
        };
       
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thick" },
            left: { style: "thin" },
            bottom: { style: "thick" },
            right: { style: "thin" },
        };
    });


    worksheet.eachRow((row, rowNumber) => {
  
      row.eachCell((cell, colNumber) => {

              cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
              };
          
      });
  });

   

    worksheet.mergeCells(`A${pointer+2}:A${data.length+pointer}`); 
  
    const mergedCell = worksheet.getCell(`A${pointer+2}`);
     mergedCell.value = "T\nÝ\nŽ\nD\nE\nŇ"
    mergedCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFFFF" }, 
  };

    mergedCell.alignment = {
        vertical: "middle", // Align vertically
        horizontal: "center", // Align horizontally
        wrapText: true,
    };

    if (data.length > 4){ pointer += data.length; }
    else{ pointer += 4;}
   
    
   }

    worksheet.columns = [
        { width: 10 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 12 },
        { width: 14 },
        { width: 20 },
    ];


   

    // Export the workbook as a file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rozvrh.xlsx";
    link.click();
}



