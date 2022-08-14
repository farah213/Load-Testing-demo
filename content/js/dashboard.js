/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7758620689655172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 564.4642857142857, 56, 2836, 332.5, 1042.2000000000012, 2369.799999999997, 2836.0, 0.7121420214659953, 19.288785909125593, 0.7384201415382268], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 1, 0, 0.0, 2836.0, 2836, 2836, 2836.0, 2836.0, 2836.0, 2836.0, 0.3526093088857546, 98.65932706717207, 1.0709130377291962], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 1, 0, 0.0, 846.0, 846, 846, 846.0, 846.0, 846.0, 846.0, 1.1820330969267139, 103.74071919326242, 4.458019355791962], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 12.787482443820224, 1.3320751404494382], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5194481382978723, 1.9471884498480243], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5452730678233438, 2.02089905362776], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.5387931034482758, 2.008228840125392], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5222101586102719, 1.9354229607250755], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 3.749302455357143, 11.090959821428571], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 1, 0, 0.0, 895.0, 895, 895, 895.0, 895.0, 895.0, 895.0, 1.1173184357541899, 5.6400576117318435, 4.395076815642458], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.535436137071651, 1.9896320093457944], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5323938862928349, 1.9957165109034267], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.5240091463414633, 1.953125], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5404874213836478, 2.008402122641509], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 891.4529551630435, 6.220278532608695], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 10.106739645708583, 1.2747941616766467], "isController": false}, {"data": ["Test", 1, 0, 0.0, 5367.0, 5367, 5367, 5367.0, 5367.0, 5367.0, 5367.0, 0.1863238308179616, 70.65366912381218, 2.7047888135830074], "isController": true}, {"data": ["https://blazedemo.com/reserve.php", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 8.339102056962025, 4.777739319620253], "isController": false}, {"data": ["https://blazedemo.com/-5", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 11.891256549401197, 1.5233205464071855], "isController": false}, {"data": ["https://blazedemo.com/-4", 1, 0, 0.0, 958.0, 958, 958, 958.0, 958.0, 958.0, 958.0, 1.04384133611691, 129.22327603079333, 0.5290563021920668], "isController": false}, {"data": ["https://blazedemo.com/-3", 1, 0, 0.0, 714.0, 714, 714, 714.0, 714.0, 714.0, 714.0, 1.4005602240896358, 54.00910364145658, 0.7112219887955182], "isController": false}, {"data": ["https://blazedemo.com/-2", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 40.95768134949349, 0.7320685600578872], "isController": false}, {"data": ["https://blazedemo.com/-1", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 209.2185507015306, 1.3377909757653061], "isController": false}, {"data": ["https://blazedemo.com/-0", 1, 0, 0.0, 1800.0, 1800, 1800, 1800.0, 1800.0, 1800.0, 1800.0, 0.5555555555555556, 1.7513020833333333, 0.2685546875], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5163094788519638, 1.9354229607250755], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.5285980504587156, 1.959097859327217], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.5145958083832335, 1.9180389221556886], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.525611620795107, 1.953125], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 3.749302455357143, 11.090959821428571], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 8.367723034274194, 1.5160345262096775], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
