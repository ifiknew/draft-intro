import React from 'react';
import CanvasDraw from "react-canvas-draw"
import styles from './index.css';
import { Icon } from 'antd'
const EDGE = 299
class Index extends React.Component {
  state = {
    imageSrc: null,
    key: new Date().valueOf(),
    imgs: []
  }
  canvas: any = null

  handleDelete = () => {
    this.canvas.clear()
    this.canvas.ctx.drawing.fillStyle = '#fff'
    this.canvas.ctx.drawing.fillRect(0, 0, EDGE, EDGE)
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
    if (this.canvas != canvas) {
      this.canvas = canvas
      setTimeout(() => {
        this.canvas.ctx.drawing.fillStyle = '#fff'
        this.canvas.ctx.drawing.fillRect(0, 0, EDGE, EDGE)
      }, 1000)
    }


  }

  getData = async () => {
    if (this.canvas == null) { return }
    const data: ImageData = this.canvas.ctx.drawing.getImageData(0,0, EDGE, EDGE)
    fetch('http://218.94.159.108:12345', {
      method: 'POST',
      body: JSON.stringify(Array.from(data.data.filter((_,index) => index % 4 != 3)))
    }).then(res => res.text()).then(text => {
      const imgs = text.replace('{"data": ', '').replace('}', '').split(',').slice(0,10)
      this.setState({ imgs })
    })
  }

  render = () => {
    return (
      <div className={styles.body}>

          <React.Fragment>
            <div className={styles.canvas}>
              <CanvasDraw
                canvasWidth={EDGE}
                canvasHeight={EDGE}
                brushRadius={1}
                lazyRadius={1}
                brushColor="#000"
                ref={this.getRef}
              />
            </div>
            <div className={styles.predictionGroup}>
              <div>
                {this.state.imgs.slice(0,5).map(v => <img src={`http://218.94.159.108:12336/static/photo/${v}`} key={v} />)}
              </div>
              <div>
                {this.state.imgs.slice(5,10).map(v => <img src={`http://218.94.159.108:12336/static/photo/${v}`} key={v} />)}
              </div>
            </div>
            <div className={styles.itemGroup}>
              <Icon type="delete" onClick={this.handleDelete} />
              <Icon type="undo" onClick={this.handleUndo} />
              <Icon type="file" onClick={this.handleUpload}/>
              <Icon type="search" onClick={this.getData} />
            </div>
          </React.Fragment>

      </div>
    )
  }
}

export default Index
