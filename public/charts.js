function showAnswer(target, answer, scale) {
    console.log(answer);

    var w = 175 * scale, //width
        h = 175 * scale; //height

    var vis = d3.select(target);

    vis.selectAll("#chart")
        .append("text")
        .text("Hint: " + answer + "%")
        .attr("x", -w)
        .attr("y", -h + 32);
}

function drawChart(target, type, data, rotate, scale) //types: "Pie Chart", "Donut Chart", "Pie Angle Chart", "Donut Angle Chart", "Arc-Length Chart", "Area Chart"
{
    var w = 354 * scale, //width
        h = 354 * scale, //height
        outer = 150 * scale, //radius
        inner = outer - 5 * scale, //radius
        pad = 2 * scale, //svg padding
        donutR = 75 * scale, //radius for donut
        dotSize = 8 * scale, //radius for red dot
        dotOrbit = 170 * scale, //radius for red dot placement
        lineWeight = 1.5 * scale, //lineweight
        radialLineWeight = 1.5 * scale,
        sliceLineWeight = 5 * scale,
        maskLineWeight = 13 * scale,
        blue = "#1f78b4",
        gray = "#dddddd",
        darkGray = "#888888";

    var defs = d3.select(target).append("defs").attr("id", "clip");
    var clip = defs.append("clipPath")
        .attr("id", "clip");
    var clipper = clip.append("circle")
        .attr("cx", outer)
        .attr("cy", outer)
        .attr("r", outer)
        .attr("fill", "#000000");

    var vis = d3.select(target)
        .data([data])
        .attr("width", w + 2 * pad)
        .attr("height", h + 2 * pad)
        .append("g")
        .attr("transform", "translate(" + (w / 2 + pad) + "," + (h / 2 + pad) + ")")
        .attr("id", "chart");

    var pieData = d3.layout.pie()
        .value(function(d) {
            return d.value;
        });

    var background = vis.append("rect")
        .attr("width", 2 * w / 2 + pad)
        .attr("height", 2 * h / 2 + pad)
        .attr("fill", "#ffffff")
        .attr("transform", "translate(" + (-w / 2 - pad) + "," + (-h / 2 - pad) + ")");

    // -------------------------- Pie Area Chart (Baseline) --------------------------
    if (type == "Pie Chart") {
        var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(outer);

        var arcs = vis.selectAll("g.slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice")
            .attr("transform", "rotate(" + rotate + ")");

        arcs.append("path")
            .attr("d", arc)
            .attr("stroke-width", lineWeight)
            .attr("fill", function(d) {
                if (d.data.focus)
                    return blue;
                else
                    return gray;
            });
    }

    // -------------------------- Donut Area Chart (Baseline) --------------------------
    if (type == "Donut Chart") {
        var arc = d3.svg.arc()
            .innerRadius(donutR)
            .outerRadius(outer);

        var arcs = vis.selectAll("g.slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice")
            .attr("transform", "rotate(" + rotate + ")");

        arcs.append("path")
            .attr("d", arc)
            .attr("stroke-width", lineWeight)
            .attr("fill", function(d) {
                if (d.data.focus)
                    return blue;
                else
                    return gray;
            });
    }

    // -------------------------- Pie Angle Chart --------------------------
    if (type == "Pie Angle Chart") {
        var degreesA = 0,
            degreesB = 0;
        if (data[0].value > 50)
            degreesB = data[1].value * 3.6;
        else
            degreesA = data[0].value * 3.6;

        var pointersA = vis.append("g")
            .attr("transform", "rotate(" + (rotate - degreesA) + ")");
        var pointersB = vis.append("g")
            .attr("transform", "rotate(" + (rotate - degreesB) + ")");

        var pointer1A = pointersA.append("polygon")
            .attr("points", (-8 * scale) + "," + (15 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-8 * scale) + "," + (35 * scale - outer))
            .attr("fill", darkGray);

        var pointer1B = pointersB.append("polygon")
            .attr("points", (8 * scale) + "," + (15 * scale - outer) + " 0," + (25 * scale - outer) + " " + (8 * scale) + "," + (35 * scale - outer))
            .attr("fill", darkGray);

        var pointer2A = pointersA.append("polygon")
            .attr("points", (-6.5 * scale) + "," + (16 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-6.5 * scale) + "," + (34 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 32 * scale + ")");

        var pointer2B = pointersB.append("polygon")
            .attr("points", (6.5 * scale) + "," + (16 * scale - outer) + " 0," + (25 * scale - outer) + " " + (6.5 * scale) + "," + (34 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 32 * scale + ")");

        var pointer3A = pointersA.append("polygon")
            .attr("points", (-5 * scale) + "," + (17 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-5 * scale) + "," + (33 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 64 * scale + ")");

        var pointer3B = pointersB.append("polygon")
            .attr("points", (5 * scale) + "," + (17 * scale - outer) + " 0," + (25 * scale - outer) + " " + (5 * scale) + "," + (33 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 64 * scale + ")");

        var pointer4A = pointersA.append("polygon")
            .attr("points", (-3.5 * scale) + "," + (18 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-3.5 * scale) + "," + (32 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 96 * scale + ")");

        var pointer4B = pointersB.append("polygon")
            .attr("points", (3.5 * scale) + "," + (18 * scale - outer) + " 0," + (25 * scale - outer) + " " + (3.5 * scale) + "," + (32 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 96 * scale + ")");


        var arc = d3.svg.arc()
            .outerRadius(outer);

        var arcs = vis.selectAll("g.slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice")
            .attr("stroke", blue)
            .attr("stroke-width", lineWeight)
            .attr("fill-opacity", 0)
            .attr("transform", "rotate(" + rotate + ")");

        arcs.append("path")
            .attr("d", arc);

        var mask = vis.append("circle")
            .attr("r", outer - radialLineWeight)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", maskLineWeight)
            .attr("fill-opacity", 0);
    }


    // -------------------------- Donut Angle Chart --------------------------
    if (type == "Donut Angle Chart") {
        var degreesA = 0,
            degreesB = 0;
        if (data[0].value > 50)
            degreesB = data[1].value * 3.6;
        else
            degreesA = data[0].value * 3.6;

        var pointersA = vis.append("g")
            .attr("transform", "rotate(" + (rotate - degreesA) + ")");
        var pointersB = vis.append("g")
            .attr("transform", "rotate(" + (rotate - degreesB) + ")");

        var pointer1A = pointersA.append("polygon")
            .attr("points", (-8 * scale) + "," + (15 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-8 * scale) + "," + (35 * scale - outer))
            .attr("fill", darkGray);

        var pointer1B = pointersB.append("polygon")
            .attr("points", (8 * scale) + "," + (15 * scale - outer) + " 0," + (25 * scale - outer) + " " + (8 * scale) + "," + (35 * scale - outer))
            .attr("fill", darkGray);

        var pointer2A = pointersA.append("polygon")
            .attr("points", (-6.5 * scale) + "," + (16 * scale - outer) + " 0," + (25 * scale - outer) + " " + (-6.5 * scale) + "," + (34 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 32 * scale + ")");

        var pointer2B = pointersB.append("polygon")
            .attr("points", (6.5 * scale) + "," + (16 * scale - outer) + " 0," + (25 * scale - outer) + " " + (6.5 * scale) + "," + (34 * scale - outer))
            .attr("fill", darkGray)
            .attr("transform", "translate(0, " + 32 * scale + ")");


        var arc = d3.svg.arc()
            .outerRadius(outer);

        var arcs = vis.selectAll("g.slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice")
            .attr("stroke", blue)
            .attr("stroke-width", lineWeight)
            .attr("fill-opacity", 0)
            .attr("transform", "rotate(" + rotate + ")");

        arcs.append("path")
            .attr("d", arc);


        var donutMask = vis.append("circle")
            .attr("r", donutR)
            .attr("fill", "#ffffff");

        var mask = vis.append("circle")
            .attr("r", outer - radialLineWeight)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", maskLineWeight)
            .attr("fill-opacity", 0);
    }

    // -------------------------- Arc Chart --------------------------
    if (type == "Arc-Length Chart") {
        var arc = d3.svg.arc()
            .innerRadius(inner)
            .outerRadius(outer);

        var arcs = vis.selectAll("g.slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice")
            .attr("fill", function(d) {
                if (d.data.focus)
                    return blue;
                else
                    return gray;
            })
            .attr("transform", "rotate(" + rotate + ")");

        arcs.append("path")
            .attr("d", arc);

        arc.innerRadius(outer - 60 * scale)
            .outerRadius(outer);
    }

    // -------------------------- Area Chart --------------------------
    if (type == "Area Chart") {
        var visArea = vis.append("g")
            .attr("class", "Area Chart")
            .attr("transform", "rotate(" + rotate + ")");

        var whole = visArea.append("circle")
            .attr("class", "whole")
            .attr("r", outer)
            .attr("fill", gray);

        var part = visArea.append("rect")
            .attr("class", "part")
            .attr("y", outer + (outer * Math.cos(newtonSolver(data[0].value / 100) / 2)))
            .attr("width", outer * 2)
            .attr("height", outer * 2)
            .attr("transform", "translate(" + (-outer) + "," + (-outer) + ")")
            .attr("fill", blue)
            .attr("clip-path", "url(#clip)");
    }
    var label = vis.append("text")
        .text(type)
        .attr("x", -175)
        .attr("y", -163)
        .attr("fill", gray);

    // showAnswer(target, "50", 1);
}

function makeData(count, dataOptions) {
    var data = [{
        "focus": true,
        "value": dataOptions[count]
    }, {
        "focus": false,
        "value": 100 - dataOptions[count]
    }]
    return data;
}

function visualVariables(target, type, data, rotate, scale, variables) {
    var w = 354 * scale, //width
        h = 354 * scale, //height
        outer = 150 * scale, //radius
        inner = outer - 5 * scale, //radius
        pad = 2 * scale, //svg padding
        lineWeight = 1.5 * scale, //lineweight
        donutR = 75 * scale, //radius for donut
        blue = "#1f78b4",
        gray = "#dddddd";

    var degreesA = 0,
        degreesB = 0;
    if (data[0].value > 50)
        degreesB = data[1].value * 3.6;
    else
        degreesA = data[0].value * 3.6;

    var vis = d3.select(target)
        .data([data])
        .attr("width", w + 2 * pad)
        .attr("height", h + 2 * pad)
        .append("g")
        .attr("transform", "translate(" + (w / 2 + pad) + "," + (h / 2 + pad) + ")")
        .attr("id", "chart");

    var pieData = d3.layout.pie()
        .value(function(d) {
            return d.value;
        });

    var pointersA = vis.append("g")
        .attr("transform", "rotate(" + (rotate - degreesA) + ")");
    var pointersB = vis.append("g")
        .attr("transform", "rotate(" + (rotate - degreesB) + ")");

    var arcs = vis.selectAll("g.slice")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "slice")
        .attr("visibility", function(d) {
            if (d.data.focus)
                return "visible";
            else
                return "hidden";
        })
        .attr("transform", "rotate(" + rotate + ")");

    if (variables[0]) {
        var arcLineA = pointersA.append("line")
            .attr("x1", 0)
            .attr("y1", -outer)
            .attr("x2", 0)
            .attr("y2", -outer - 20)
            .attr("stroke-width", lineWeight)
            .attr("stroke", "#000000");

        var arcLineB = pointersB.append("line")
            .attr("x1", 0)
            .attr("y1", -outer)
            .attr("x2", 0)
            .attr("y2", -outer - 20)
            .attr("stroke-width", lineWeight)
            .attr("stroke", "#000000");

        var arc = d3.svg.arc()
            .innerRadius(outer + 10)
            .outerRadius(outer + 11);

        vis.append("text")
            .text("Arc-Length")
            .attr("x", -180)
            .attr("y", -130);

        arcs.append("path")
            .attr("d", arc);
    }

    if (variables[1]) {
        var angle = d3.svg.arc()
            .innerRadius(outer - 131)
            .outerRadius(outer - 130);

        var angleLineA = pointersA.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -donutR)
            .attr("stroke-width", lineWeight)
            .attr("stroke", "#000000");

        var angleLineB = pointersB.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -donutR)
            .attr("stroke-width", lineWeight)
            .attr("stroke", "#000000");

        vis.append("text")
            .text("Angle")
            .attr("x", 4)
            .attr("y", 10);

        arcs.append("path")
            .attr("d", angle)
    }

    if (variables[2]) {
        vis.append("text")
            .text("Area")
            .attr("x", -95)
            .attr("y", -65);
    }
}

function newtonSolver(p) {
    //this function solves theta-sin(theta)=2*Math.PI*p via Newton Method
    var rhs = 2 * Math.PI * p;
    var theta = 3.14;
    while (Math.abs(theta - Math.sin(theta) - rhs) > .0001) {
        theta = theta - (theta - Math.sin(theta) - rhs) / (1 - Math.cos(theta));
    }
    return theta;
}