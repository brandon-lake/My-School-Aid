import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { VictoryChart, VictoryBar, VictoryPie, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory';

/* This file renders the admin page, which can be used to visualize the data on flashcard deck usage, using the victory library */
const AdminPanel = () => {

    const [data, setData] = useState([]);
    const [dataToShow, setDataToShow] = useState([]);
    const [xLabels, setXLabels] = useState([]);
    const [xLabelsToShow, setXLabelsToShow] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const [dataCount, setDataCount] = useState(5);
    const [titles, setTitles] = useState([]);
    const [titlesToShow, setTitlesToShow] = useState([]);
    const controller = new AbortController();
    const signal = controller.signal;
    
    useEffect(() => {
        var formData = new FormData();
        formData.append("dataToQuery", "deckUsage");

        // do fetch
        fetch("https://csunix.mohawkcollege.ca/~000766089/capstone/backend.php", {
            method: "POST",
            headers: new Headers(),
            body: formData,
            signal: signal
        }).then(response => {
            return response.json();
        }).then(data => {
            // do something with returned data
            var allData = [];
            var formattedData = [];
            var localTitles = [];
            var xTicks = [];

            for (let i = 0; i < data[1].length; i++) {
                allData.push({ TimesUsed: parseInt(data[1][i].TimesUsed), Title: data[1][i].Title });
            }
            allData.sort((a, b) => b.TimesUsed - a.TimesUsed);

            for (let i = 0; i < allData.length; i++) {
                formattedData.push({ x: i + 1, y: parseInt(allData[i].TimesUsed) });
                localTitles.push({ id: i, title: allData[i].Title });
                xTicks.push(i + 1);
            }

            setData(formattedData);
            setDataToShow(formattedData);
            setTitles(localTitles);
            setTitlesToShow(localTitles);
            setXLabels(xTicks);
            setXLabelsToShow(xTicks);
        }).catch(err => {
            // error handling
        });

        return () => {
            controller.abort();
        }
    }, []);

    const updateDataCount = (e) => {
        var count = e.target.value;
        setDataCount(count);

        let slicedData = [...data].slice(0, count);
        let slicedLabels = [...xLabels].slice(0, count);
        let slicedTitles = [...titles].slice(0, count);
        setDataToShow(slicedData);
        setXLabelsToShow(slicedLabels);
        setTitlesToShow(slicedTitles);
    }
    const updateChartType = (e) => {
        setChartType(e.target.value);
    }

    const legend = titlesToShow.map(title => {
        return (<li key={title.id}>{title.title}</li>)
    });

    return (
        <>
            <div>
                <h2 className="text-center mt-4 mb-5">ADMIN PANEL</h2>
            </div>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-2 text-right pt-2 pr-0">Show top</div>
                    <div className="col-1">
                        <Form.Control className="text-center" type="number" value={dataCount} onChange={updateDataCount}/>
                    </div>
                    <div className="col-1 pt-2 pl-0">decks</div>
                    <div className="col-3">
                        <Form.Control className="w-50" style={center} as="select" value={chartType} onChange={updateChartType}>
                            <option value="bar">Bar Chart</option>
                            <option value="pie">Pie Chart</option>
                        </Form.Control>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-3 pl-0 pr-0 position-relative">
                        <div className="verticalCenter">
                            <h5><b><u>Title Legend</u></b></h5>
                            <ol className="legend">{legend}</ol>
                        </div>
                    </div>
                    <div className="col-6 pl-0 pr-0">
                        <div className="container pt-3">
                            <div className="row justify-content-center pt-4">
                                <h5><u>Deck vs Times Used</u></h5>
                            </div>
                        </div>
                        {chartType === "bar" &&
                            <VictoryChart theme={VictoryTheme.material} barRatio={1} domainPadding={20} padding={{ top: 0, bottom: 70, left: 50, right: 20 }} >
                                <VictoryAxis tickValues={xLabelsToShow} label={"Deck #"} axisLabelComponent={
                                    <VictoryLabel x={190} y={310} textAnchor="middle" style={{ textDecoration: "underline" }} />
                                } />
                                <VictoryAxis dependentAxis tickFormat={x => x} label={"Times Used"} axisLabelComponent={
                                    <VictoryLabel x={15} y={145} textAnchor="middle" style={{ textDecoration: "underline" }} />
                                } />
                                <VictoryBar data={dataToShow} x="x" y="y" alignment="middle" width={20} labels={ ({ datum }) => datum.y } />
                            </VictoryChart>
                        }
                        {chartType === "pie" &&
                            <svg viewBox="0 0 400 400">
                                <VictoryPie
                                    padding={{ top: 30, bottom: 30, left: 0, right: 0 }}
                                    colorScale="qualitative"
                                    standalone={false}
                                    data={dataToShow}
                                    innerRadius={0} labelRadius={90}
                                    style={{ labels: { fontSize: 20, fill: "white" } }}
                                    x="x" y="y"
                                />
                            </svg>
                        }
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </>
    );
};
const center = {
    margin: "auto"
}
export default AdminPanel;