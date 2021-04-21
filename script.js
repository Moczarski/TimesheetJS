let table = document.querySelector('table');
let startTimeHoursSelect = [];
let startTimeHours = [];
let startTimeMinutesSelect = [];
let startTimeMinutes = [];
let endTimeHoursSelect = [];
let endTimeHours = [];
let endTimeMinutesSelect = [];
let endTimeMinutes = [];
let breakTimeHoursSelect = [];
let breakTimeHours = [];
let breakTimeMinutesSelect = [];
let breakTimeMinutes = [];
let elementHour = [];
let startTimeInMinutes = [];
let endTimeInMinutes = [];
let breakTimeInMinutes = [];
let totalInMinutes = [];
let transportFee = [];
let note = [];
let countTime = 0;
let countFee = 0;

	
const createTable = () => {
    table.innerHTML = 
    `<tr>
        <td colspan="2">Data generowania raportu <input required placeholder="dd/mm/rrrr" type="text" size="10" id="dateOfGenerating"></td>
        <td colspan="2">Imię i nazwisko <input required type="text" id="name"></td>
    </tr>
    <tr>
        <th>Dzień</th>
        <th>Start</th>
        <th>Koniec</th>
        <th>Czas przerwy</th>
        <th>Godziny pracy</th>
        <th>Koszt dojazdu</th>
        <th>Uwagi</th>
    </tr>`;

    let k = 1;
    for (i=1; i<=93; i+=3) {
        table.innerHTML += 
        `<tr>
            <td>`+k+`</td>
            <td>
                <select id="getHours`+i+`" name="start_time" onchange="calc()"></select>:
                <select id="getMinutes`+i+`" name="start_time" onchange="calc()"></select>
            </td>
            <td>
                <select id="getHours`+(i+1)+`" name="finish_time" onchange="calc()"></select>:
                <select id="getMinutes`+(i+1)+`" name="finish_time" onchange="calc()"></select>
            </td>
            <td>
                <select id="getHours`+(i+2)+`" name="break_time" onchange="calc()"></select>:
                <select id="getMinutes`+(i+2)+`" name="break_time" onchange="calc()"></select>
            </td>
            <td>
                <input type="text" id="totalWorkingHours`+k+`"  value="0" readonly>
            </td>
            <td>
                <form action="#">
                    <p><input type="number" id="transFee`+k+`" name="transFee" value="0" onchange="calc()"></p>
                </form>
            </td>
            <td>
                <form action="#">
                    <input type="text" name="note" id="note`+k+`">
                </form>
            </td>
        </tr>`;
        k++;
    }

    table.innerHTML +=
    `<tr>
		<td>
            <button onclick="importValues();">Import</button>
            <input type="file" id="url" name="url" accept=".json">
		</td>
		<td>
			<button onclick="exportValues();">Eksport</button>
		</td>
        <td colspan="2" align="right">
            Suma
        </td>
        <td>
            <input type="text" id="totalTime" name="totalTime"  value="0" readonly>
        </td>
        <td>
            <input type="text" id="totalTransport" name="totalTransport" value="0" readonly>
        </td>
        <td>
        </td>
    </tr>`;


    for (j=1; j<=93; j++) {
        elementHour[j] = document.getElementById('getHours'+j);
        for(var i = 0; i <= 23; i++){
            let option = document.createElement("option");
            option.value = i;
            option.innerText = ("0" + i).slice(-2);
            elementHour[j].appendChild(option);
        }
    }

    let elementMinute = [];
    for (j=1; j<=93; j++) {
        elementMinute[j] = document.getElementById('getMinutes'+j);
        for(var i = 0; i <= 50; i += 15){
            let option = document.createElement("option");
            option.value = i;
            option.innerText = ("0" + i).slice(-2);
            elementMinute[j].appendChild(option);
        }
    }
}

const importValues = () => {
    if (!document.getElementById("url").value) {
        alert("Wprowadź ścieżkę do pliku!");
    } else {
        let files = document.getElementById('url').files;
        let jsonReader = new FileReader();
        jsonReader.onload = function(e) { 
            let jsonFile = JSON.parse(e.target.result);
            document.getElementById("dateOfGenerating").value = jsonFile.date;
            document.getElementById("name").value = jsonFile.name;

            let j = 1;
            for (i=1; i<=31; i++) {
                document.getElementById("getHours"+j).value = jsonFile.startTimeHours[i];
                document.getElementById("getMinutes"+j).value = jsonFile.startTimeMinutes[i];
                j++;
                document.getElementById("getHours"+j).value = jsonFile.endTimeHours[i];
                document.getElementById("getMinutes"+j).value = jsonFile.endTimeMinutes[i];
                j++;
                document.getElementById("getHours"+j).value = jsonFile.breakTimeHours[i];
                document.getElementById("getMinutes"+j).value = jsonFile.breakTimeMinutes[i];
                document.getElementById('transFee'+i).value = jsonFile.transportFee[i];
                j++;
                document.getElementById('totalWorkingHours'+i).value = Math.floor(jsonFile.totalInMinutes[i]/60) + ":" + jsonFile.totalInMinutes[i]%60;
                document.getElementById("note"+i).value = jsonFile.note[i];
            }

            document.getElementById("totalTime").value = Math.floor(jsonFile.countTime/60) + ":" + jsonFile.countTime%60;;
            document.getElementById("totalTransport").value = jsonFile.countFee;
            alert("Zaimportowano!");
        }
        jsonReader.readAsText(files.item(0));
    }
}

const exportValues = () => {
    if (!document.getElementById("dateOfGenerating").value || !document.getElementById("name").value) {
        alert("Wprowadź datę oraz imię i nazwisko!");
    } else {
        let date = document.getElementById("dateOfGenerating").value;
        let name = document.getElementById("name").value;
        let dataToExport = {
            "date": date,
            "name": name,
            "startTimeHours": startTimeHours,
            "startTimeMinutes": startTimeMinutes,
            "endTimeHours": endTimeHours,
            "endTimeMinutes": endTimeMinutes,
            "breakTimeHours": breakTimeHours,
            "breakTimeMinutes": breakTimeMinutes,
            "totalInMinutes": totalInMinutes,
            "transportFee": transportFee,
            "countTime": countTime,
            "countFee": countFee,
            "note": note
        };
        let exportFile = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", exportFile);
        downloadAnchorNode.setAttribute("download", date+name+".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

const calc = () => {
	let totalTransport = document.getElementById('totalTransport');
	let totalTime = document.getElementById('totalTime');
    let j=1;
    countTime = 0;
    countFee = 0;
    //loop for generating variables
    for (i=1; i<=31; i++) {
        startTimeHoursSelect[i] = document.getElementById("getHours"+j);
        startTimeHours[i] = startTimeHoursSelect[i].options[startTimeHoursSelect[i].selectedIndex].value;
        startTimeMinutesSelect[i] = document.getElementById("getMinutes"+j);
        startTimeMinutes[i] = startTimeMinutesSelect[i].options[startTimeMinutesSelect[i].selectedIndex].value;
        j++;
        endTimeHoursSelect[i] = document.getElementById("getHours"+j);
        endTimeHours[i] = endTimeHoursSelect[i].options[endTimeHoursSelect[i].selectedIndex].value;
        endTimeMinutesSelect[i] = document.getElementById("getMinutes"+j);
        endTimeMinutes[i] = endTimeMinutesSelect[i].options[endTimeMinutesSelect[i].selectedIndex].value;
        j++;
        breakTimeHoursSelect[i] = document.getElementById("getHours"+j);
        breakTimeHours[i] = breakTimeHoursSelect[i].options[breakTimeHoursSelect[i].selectedIndex].value;
        breakTimeMinutesSelect[i] = document.getElementById("getMinutes"+j);
        breakTimeMinutes[i] = breakTimeMinutesSelect[i].options[breakTimeMinutesSelect[i].selectedIndex].value;
        j++;
        startTimeInMinutes[i] = toMinutes(startTimeHours[i], startTimeMinutes[i]);
        endTimeInMinutes[i] = toMinutes(endTimeHours[i], endTimeMinutes[i]);
        breakTimeInMinutes[i] = toMinutes(breakTimeHours[i], breakTimeMinutes[i]);
        totalInMinutes[i] = endTimeInMinutes[i] - startTimeInMinutes[i] - breakTimeInMinutes[i];
        if (document.getElementById('totalWorkingHours'+i) != null) {
            document.getElementById('totalWorkingHours'+i).value = Math.floor(totalInMinutes[i]/60) + ":" + totalInMinutes[i]%60;
        }
        transportFee[i] = Number.parseFloat(document.getElementById('transFee'+i).value);
        countTime += totalInMinutes[i];
        countFee += transportFee[i];
        note[i] = document.getElementById("note"+i).value;
    }
    totalTime.value = Math.floor(countTime/60) + ":" + countTime%60;
    totalTransport.value = countFee;
}

const toMinutes = (hours, minutes) => {
    return Number.parseInt(hours)*60 + Number.parseInt(minutes);
}