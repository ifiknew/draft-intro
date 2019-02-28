import React from 'react';
import CanvasDraw from "react-canvas-draw"
import styles from './index.css';
import { Icon } from 'antd'

class Index extends React.Component {
  state = {
    imageSrc: null,
    key: new Date().valueOf()
  }
  canvas:any = null

  componentDidMount = () => {
    window.setInterval(
      this.getData,
      1000
    )
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
          this.canvas.ctx.drawing.drawImage(image, 0, 0, 300, 300)
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
    const data: ImageData = this.canvas.ctx.drawing.getImageData(0,0, 300, 300)
    console.log(data)
  }
  render = () => {
    return (
      <div className={styles.body}>
        <CanvasDraw
          canvasWidth={300}
          canvasHeight={300}
          brushRadius={1}
          lazyRadius={10}
          brushColor="#000"
          ref={this.getRef}
        />
        <div className={styles.itemGroup}>
          <Icon type="delete" onClick={this.handleDelete} />
          <Icon type="undo" onClick={this.handleUndo} />
          <Icon type="file" onClick={this.handleUpload}/>
        </div>
      </div>
    )
  }
}

export default Index
