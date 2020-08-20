import React from 'react';
import data from './data.json'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './App.css'; 

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      selected: []
    }
  }
  
  handleSelect = val => {
    this.setState(prev => {
      let arr = [...prev.selected]
      let flag = false;
      let index ;
      for(var i = arr.length - 1; i >= 0; i--) {
        if(arr[i] === val) {
            flag = true
            index = i
            break
        }
      }
      if (flag)
        arr.splice(index, 1)
      else 
        arr.push(val)
      return({selected: [...arr]})
    })
  }

  pickSelectedCols = (selectedValues) => {
    let indexes = [...selectedValues]
    indexes = indexes.sort()
    let { body, head } = data
    let arr = []
    let arrCol = []
    let x =0
    while(x < data.body.length) {
      let newArr1 = []
      let w=0
      while(w < indexes.length) {
        newArr1.push(body[x][indexes[w]])
        w=w+1
      }
      arr.push(newArr1)
      x++
    }
    let newArr2 = []
    for(let i=0; i< indexes.length; i++)
      newArr2.push(head[i])
    arrCol.push(newArr2)
    return {arr, arrCol}
  }

  handleExportasCsv = (selectedValues) => {
    let {arr, arrCol} = this.pickSelectedCols(selectedValues)
    let csvArr = [...arrCol];
    for(let i=0; i<arr.length; i++)
      csvArr.push(arr[i].join(","))
    let str = csvArr.join("%0A")
    
    let a = document.createElement("a")
    a.href='data:attachment/csv,' + str
    a.target='_blank'
    a.download='file.csv'
    document.body.appendChild(a)
    a.click()
  }

  handleExportasPdf = (selectedValues) => {
    let {arr, arrCol} = this.pickSelectedCols(selectedValues)
    const doc = new jsPDF()
    doc.autoTable({
      head: [...arrCol],
      body: [...arr]
    })
    doc.save('file.pdf')
  }

  render() {
    const column = data.head.map((val, i) => {
      let flag = this.state.selected.some(val => val === i)
      return (
        <th key={i} className={`col-head ${flag ? "selected" : " "}`} id={i} onClick={() => this.handleSelect(i)}>
          {val.toUpperCase()}
        </th>
      )
    })

    const body = data.body.map((val, index) => {
      let row = val;
      return (
        <tr key={index}>
          {
            row.map((v, i) => {
              let flag = this.state.selected.some(val => val === i)
              return(
                <td key={i} className={`row-elem ${flag ? "selected" : " "}`} onClick={() => this.handleSelect(i)}>{v}</td>
              )
            })
          }
        </tr>
      )
    })

    return (
      <div className="App">
        <table>
          <caption>Click on a column to select or unselect it</caption>
          <thead>
            <tr>
              {column}
            </tr>
          </thead>
          <tbody>
              {body}
          </tbody>
        </table>
        <div className="show-counter">
          Columns selected: {this.state.selected.length} / {data.body.length-1}
        </div>
        <div>
          <button 
            disabled={this.state.selected.length > 0 ? false : true} 
            className={"export-btn " + (this.state.selected.length > 0 ? "btn-active" : "btn-disabled")}
            onClick={() => this.handleExportasCsv(this.state.selected)}
          >
              {this.state.selected.length > 0 && "Export as csv file >"}
              {this.state.selected.length === 0 && "Select atleast one column to export"}
          </button>
        </div>
        <div style={{margin: "20px auto 0 auto"}}>
          <button 
            disabled={this.state.selected.length > 0 ? false : true} 
            className={"export-btn " + (this.state.selected.length > 0 ? "btn-active-pdf" : "btn-disabled-pdf")}
            onClick={() => this.handleExportasPdf(this.state.selected)}
          >
              {this.state.selected.length > 0 && "Export as pdf file >"}
              {this.state.selected.length === 0 && "Select atleast one column to export"}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
