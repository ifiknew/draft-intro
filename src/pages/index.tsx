import React from 'react';
import CanvasDraw from "react-canvas-draw"
import styles from './index.css';
import { Icon } from 'antd'

const EDGE = 300
const MAX = 255
class Index extends React.Component {
  state = {
    imageSrc: null,
    key: new Date().valueOf()
  }
  canvas:any = null

  componentDidMount = () => {
    // window.setInterval(
    //   this.getData,
    //   1000
    // )
  }
  handleDelete = () => {
    this.canvas.clear()
  }

  handleUndo = () => {
    this.canvas.undo()
  }

  handleUpload = () => {
    
    const input = document.createElement("input")
    input.style.visibility = 'hidden'
    input.type = 'file'
    input.onchange = () => {
      const file = input.files[0]
      const fr = new FileReader()
      fr.onload = (e) => {
        const image = new Image()
        image.onload = () => {
          this.handleDelete()
          this.canvas.ctx.drawing.drawImage(image, 0, 0, EDGE, EDGE)
        }
        image.src = (e.target as any).result
      }
      fr.readAsDataURL(file)
      document.body.removeChild(input)
      input.onchange = null
    }
    document.body.appendChild(input)
    input.click()
  }

  getRef = (canvas) => {
    window.c = canvas
    this.canvas = canvas
  }

  getData = () => {
    if (this.canvas == null) { return }
    const data: ImageData = this.canvas.ctx.drawing.getImageData(0,0, EDGE, EDGE)
    const matrix = Array(EDGE).fill(Array(EDGE).fill([0, 0, 0]))
    matrix.forEach((row, rowIndex) => {
      row.forEach((pixel: Array<number>, columnIndex: number) => {
        const beginIndex = (rowIndex * EDGE + columnIndex) * 4
        row[columnIndex] = pixel.map((_, index) => Number.prototype.toFixed.call(data.data[beginIndex + index] / MAX, 2))
      })
    })
    console.log(matrix)
  }
  render = () => {
    return (
      <div className={styles.body}>
        <CanvasDraw
          canvasWidth={EDGE}
          canvasHeight={EDGE}
          brushRadius={1}
          lazyRadius={1}
          brushColor="#000"
          ref={this.getRef}
        />
        <div className={styles.itemGroup}>
          <Icon type="delete" onClick={this.handleDelete} />
          <Icon type="undo" onClick={this.handleUndo} />
          <Icon type="file" onClick={this.handleUpload}/>
          <Icon type="search" onClick={this.getData} />
        </div>
      </div>
    )
  }
}

export default Index
