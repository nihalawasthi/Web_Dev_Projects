
var stringYear = "";
var hourArray = ["12:00am", "1:00am", "2:00am", "3:00am", "4:00am", "5:00am", "6:00am", "7:00am", "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm", "11:00pm"];
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var stringMonth = "";
var monthDaysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//DISPLAY CURRENT DATE IN INPUT FIELDS
var currentDate_cD = new Date();
var currentDate_cYear = currentDate_cD.getFullYear();
var currentDate_cMonth = currentDate_cD.getMonth() + 1;
var currentDate_cDay = currentDate_cD.getDate();
var currentDate_cHour = currentDate_cD.getHours();

document.getElementById("taskDscrptn").value = '';
document.getElementById("yearSelect").value = currentDate_cYear;
document.getElementById("monthSelect").value = currentDate_cMonth;
document.getElementById("daySelect").value = currentDate_cDay;
document.getElementById("hourSelect").value = currentDate_cHour;
//DISPLAY CURRENT DATE IN INPUT FIELDS

//DISPLAY TABLES IF THEY EXIST
if (localStorage.objCollection !== undefined) {
  updateRatings();

  printHtmlTaskTable();

  rankTasks();

  printHtmlRankedTable();
}
//DISPLAY TABLES IF THEY EXIST

function julianHourCalc(year, month, day, hour) {

  var jHC_cD = new Date();
  var jHC_cYear = jHC_cD.getFullYear();
  var jHC_accumulatedDays = 0;
  var jHC_julianHour = 0;
  var jHC_i = 0;
  var jHC_j = 0;

  if (year !== jHC_cYear) {
    var yearDiff = year - jHC_cYear;
    for (jHC_i = 0; jHC_i < yearDiff; jHC_i++) {
      jHC_accumulatedDays = jHC_accumulatedDays + 365;
      if ((jHC_cYear + jHC_i) % 4 === 0) {
        jHC_accumulatedDays = jHC_accumulatedDays + 1;
      }
    }
  }

  for (jHC_j = 1; jHC_j < month; jHC_j++) {
    jHC_accumulatedDays = jHC_accumulatedDays + monthDaysArray[jHC_j - 1];
  }
  if ((year % 4 === 0) && (month > 2)) {
    jHC_accumulatedDays = jHC_accumulatedDays + 1;
  }

  jHC_accumulatedDays = jHC_accumulatedDays + day;
  jHC_julianHour = jHC_accumulatedDays * 24 + hour;

  return jHC_julianHour;

}

function countDownCalc(julianHour) {
  var cDC_cD = new Date();
  var cDC_cYear = cDC_cD.getFullYear();
  var cDC_cMonth = cDC_cD.getMonth() + 1;
  var cDC_cDay = cDC_cD.getDate();
  var cDC_cHour = cDC_cD.getHours();

  var cDC_cJulianHour = julianHourCalc(cDC_cYear, cDC_cMonth, cDC_cDay, cDC_cHour);
  var cDC_countDownHours = julianHour - cDC_cJulianHour;

  return cDC_countDownHours
}

function taskRateCalc(importance, julianHour) {

  var tRC_countDown = countDownCalc(julianHour);
  var tRC_imprtncPwr4 = Math.pow(importance, 4);
  var tRC_cntdwnPwr4 = Math.pow(((tRC_countDown + 0.1) / 48), 4);
  var tRC_rateCalc = tRC_imprtncPwr4 / tRC_cntdwnPwr4;

  return tRC_rateCalc;

}

function taskObjConstructor(taskDescription, year, month, day, hour, taskImportance, julianHour, taskRating) {

  this.description = taskDescription;
  this.dueYear = year;
  this.dueMonth = month;
  this.dueDay = day;
  this.dueHour = hour;
  this.importance = taskImportance;
  this.julianDueHour = julianHour;
  this.rating = taskRating;

}

function addNewObject() {

  var aNO_inputDescription = document.getElementById("taskDscrptn").value;
  var aNO_yearSelected = Number(document.getElementById("yearSelect").value);
  var aNO_monthSelected = Number(document.getElementById("monthSelect").value);;
  var aNO_daySelected = Number(document.getElementById("daySelect").value);
  var aNO_hourSelected = Number(document.getElementById("hourSelect").value);
  var aNO_importanceSelected = Number(document.getElementById("importanceSelect").value);
  var aNO_jHour = julianHourCalc(aNO_yearSelected, aNO_monthSelected, aNO_daySelected, aNO_hourSelected);
  var aNO_taskRate = taskRateCalc(aNO_importanceSelected, aNO_jHour);

  var taskObj = new taskObjConstructor(aNO_inputDescription, aNO_yearSelected, aNO_monthSelected, aNO_daySelected, aNO_hourSelected, aNO_importanceSelected, aNO_jHour, aNO_taskRate);

  var aNO_arrayObj;
  //
  if (localStorage.objCollection === undefined) {
    aNO_arrayObj = [{
      taskObj
    }];
  } else {
    aNO_arrayObj = JSON.parse(localStorage.objCollection);
    aNO_arrayObj[aNO_arrayObj.length] = {
      taskObj
    };
  }

  localStorage.objCollection = JSON.stringify(aNO_arrayObj);

  document.getElementById("taskDscrptn").value = '';

  updateRatings();
  printHtmlTaskTable();
  rankTasks();
  printHtmlRankedTable();

}

function updateRatings() {

  var uR_objUpdate = JSON.parse(localStorage.objCollection);
  var uR_i = 0;
  var uR_objLength = uR_objUpdate.length;
  var uR_taskImprtnc;
  var uR_taskJhour;

  for (uR_i = 0; uR_i < uR_objLength; uR_i++) {
    uR_taskImprtnc = uR_objUpdate[uR_i].taskObj.importance;
    uR_taskJhour = uR_objUpdate[uR_i].taskObj.julianDueHour;
    uR_objUpdate[uR_i].taskObj.rating = taskRateCalc(uR_taskImprtnc, uR_taskJhour);
  }

  localStorage["objCollection"] = JSON.stringify(uR_objUpdate);

}

function printHtmlTaskTable() {

  var pHTT_objUpdate = JSON.parse(localStorage.objCollection);
  var pHTT_amPM = "AM";
  var pHTT_amPMhour;
  var pHTT_monthString;
  var pHTT_printCount;
  var pHTT_objLength = pHTT_objUpdate.length;
  var pHTT_checkID;
  var pHTT_trCreate;
  var pHTT_tdCreate;
  var pHTT_dFrag;
  var pHTT_checkBox;
  var pHTT_tableTag = document.getElementById("unsortedTaskTable");
  pHTT_tableTag.innerHTML = '<tr><th><input type="checkbox" value="all" onclick="checkedAll()" id="selectAll"></th><th>Task Description</th><th>Due Date</th><th>Rating</th></tr>';

  for (pHTT_printCount = 0; pHTT_printCount < pHTT_objLength; pHTT_printCount++) {

    pHTT_checkID = "C" + pHTT_printCount;
    pHTT_monthString = monthArray[pHTT_objUpdate[pHTT_printCount].taskObj.dueMonth - 1];

    pHTT_amPMhour = pHTT_objUpdate[pHTT_printCount].taskObj.dueHour;
    if (pHTT_amPMhour > 11) {
      pHTT_amPM = "PM";
      if (pHTT_amPMhour > 12) {
        pHTT_amPMhour = pHTT_amPMhour - 12;
      }
    }

    pHTT_dFrag = document.createDocumentFragment();
    pHTT_trCreate = document.createElement("TR");

    pHTT_checkBox = document.createElement("INPUT");
    pHTT_checkBox.type = "checkbox";
    pHTT_checkBox.value = pHTT_printCount;
    pHTT_checkBox.id = pHTT_checkID;
    pHTT_checkBox.className = "checks";
    pHTT_trCreate.appendChild(pHTT_checkBox);

    pHTT_tdCreate = document.createElement("TD");
    pHTT_tdCreate.textContent = pHTT_objUpdate[pHTT_printCount].taskObj.description;
    pHTT_trCreate.appendChild(pHTT_tdCreate);

    pHTT_tdCreate = document.createElement("TD");
    pHTT_tdCreate.textContent = pHTT_objUpdate[pHTT_printCount].taskObj.dueDay + " " + pHTT_monthString + " " + pHTT_objUpdate[pHTT_printCount].taskObj.dueYear + " @ " + pHTT_amPMhour + pHTT_amPM;
    pHTT_trCreate.appendChild(pHTT_tdCreate);

    pHTT_tdCreate = document.createElement("TD");
    pHTT_tdCreate.textContent = pHTT_objUpdate[pHTT_printCount].taskObj.importance;
    pHTT_trCreate.appendChild(pHTT_tdCreate);

    pHTT_dFrag.appendChild(pHTT_trCreate);
    pHTT_tableTag.appendChild(pHTT_dFrag);

  }
}

function rankTasks() {
  var rT_objUnranked = JSON.parse(localStorage.objCollection);
  var rT_objRanked = JSON.parse(localStorage.objCollection);
  var rT_large;
  var rT_largePosition;
  var rT_rankPositionCount = 0;
  var rT_innerLoopCount = 0;
  var rT_objLength = rT_objUnranked.length;

  while (rT_objLength > 0) {
    rT_large = rT_objUnranked[0].taskObj.rating;
    rT_largePosition = 0;
    for (rT_innerLoopCount = 1; rT_innerLoopCount < rT_objLength; rT_innerLoopCount++) {
      if ((rT_innerLoopCount !== 0) && (rT_large < rT_objUnranked[rT_innerLoopCount].taskObj.rating)) {
        rT_large = rT_objUnranked[rT_innerLoopCount].taskObj.rating;
        rT_largePosition = rT_innerLoopCount;
      }
    }
    rT_objRanked[rT_rankPositionCount].taskObj = rT_objUnranked[rT_largePosition].taskObj;
    rT_objUnranked.splice(rT_largePosition, 1);
    rT_objLength = rT_objUnranked.length;
    rT_rankPositionCount = rT_rankPositionCount + 1;
  }

  localStorage.rankedObjCollection = JSON.stringify(rT_objRanked);

}

function printHtmlRankedTable() {

  var pHRT_objRanked = JSON.parse(localStorage.rankedObjCollection);
  var pHRT_printCount;
  var pHRT_objLength = pHRT_objRanked.length;
  var pHRT_tableID;
  var pHRT_trCreate;
  var pHRT_tdCreate;
  var pHRT_dFrag;
  var pHRT_countDown;
  var pHRT_tableTag = document.getElementById("rankedTaskTable");
  pHRT_tableTag.innerHTML = '<tr><th>Rank</th><th>Task Description</th><th>Countdown</th></tr>';

  for (pHRT_printCount = 0; pHRT_printCount < pHRT_objLength; pHRT_printCount++) {

    pHRT_countDown = countDownCalc(pHRT_objRanked[pHRT_printCount].taskObj.julianDueHour);

    pHRT_tableID = "T" + pHRT_printCount;

    pHRT_dFrag = document.createDocumentFragment();
    pHRT_trCreate = document.createElement("TR");

    pHRT_tdCreate = document.createElement("TD");
    pHRT_tdCreate.textContent = pHRT_printCount + 1;
    pHRT_trCreate.appendChild(pHRT_tdCreate);

    pHRT_tdCreate = document.createElement("TD");
    pHRT_tdCreate.textContent = pHRT_objRanked[pHRT_printCount].taskObj.description;
    pHRT_trCreate.appendChild(pHRT_tdCreate);

    pHRT_tdCreate = document.createElement("TD");
    pHRT_tdCreate.textContent = ~~(pHRT_countDown / 24) + " day(s) " + pHRT_countDown % 24 + " hour(s)";
    pHRT_trCreate.appendChild(pHRT_tdCreate);

    pHRT_dFrag.appendChild(pHRT_trCreate);
    pHRT_tableTag.appendChild(pHRT_dFrag);

  }
}

function monthDaysFunc() {

  var mDF_monthSelected = Number(document.getElementById("monthSelect").value);

  var mDF_yearSelected = Number(document.getElementById("yearSelect").value);

  var mDF_leapYear = false;

  if ((mDF_yearSelected) % 4 === 0) {
    mDF_leapYear = true;
  }

  $(".showOpt").show();

  if ((mDF_monthSelected == 6) || (mDF_monthSelected == 9) || (mDF_monthSelected == 11)) {
    $(".hideA").hide();
  } else if (mDF_monthSelected == 2 && (mDF_leapYear == false)) {
    $(".hideA").hide();
    $(".hideB").hide();
    $(".hideC").hide();
  } else if ((mDF_monthSelected == 2) && (mDF_leapYear == true)) {
    $(".hideA").hide();
    $(".hideB").hide();
  }

}

function deleteItems() {

  var dI_objDel = JSON.parse(localStorage.objCollection);
  var checkCount = 0;
  var dI_objDelLength = dI_objDel.length;
  var dI_checkPos = 0;
  var dI_checkID;

  if (document.getElementById("selectAll").checked === true) {
    dI_objDel.splice(0, dI_objDelLength);
  } else if (document.getElementById("selectAll").checked !== true) {
    for (dI_checkPos = dI_objDelLength - 1; dI_checkPos >= 0; dI_checkPos--) {
      dI_checkID = "C" + dI_checkPos;
      checkboxTruth = document.getElementById(dI_checkID).checked;
      if (checkboxTruth === true) {
        dI_objDel.splice(dI_checkPos, 1);
      }
    }
  }

  localStorage["objCollection"] = JSON.stringify(dI_objDel);

  updateRatings();

  printHtmlTaskTable();

  rankTasks();

  printHtmlRankedTable();

}

function updateRankTable() {

  updateRatings();
  rankTasks();
  printHtmlRankedTable();

}

function checkedAll() {

  var cA_checkElementsLength = document.getElementsByClassName("checks").length;
  var cA_loopCount;
  var cA_checkID;
  var cA_checkTF;

  if (document.getElementById("selectAll").checked === true) {
    cA_checkTF = true;
  } else if (document.getElementById("selectAll").checked === false) {
    cA_checkTF = false;
  }

  document.getElementById("selectAll").checked = cA_checkTF;

  for (cA_loopCount = 0; cA_loopCount < cA_checkElementsLength; cA_loopCount++) {
    cA_checkID = "C" + cA_loopCount;
    document.getElementById(cA_checkID).checked = cA_checkTF;

  }

}