import React from 'react';
import CanvasDraw from "react-canvas-draw"
import styles from './index.css';
import { Icon } from 'antd'
import * as tf from '@tensorflow/tfjs';

const EDGE = 299
const MAX = 255
class Index extends React.Component {
  state = {
    imageSrc: null,
    key: new Date().valueOf(),
    model: null as tf.Model
  }
  canvas: any = null

  async componentDidMount() {
    const tfm = await tf.loadLayersModel('http://localhost:12336/static/model/model.json')
    this.setState({
      model: tfm
    })
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
    this.canvas = canvas
  }

  getData = async () => {
    if (this.canvas == null || this.state.model == null) { return }
    const data: ImageData = this.canvas.ctx.drawing.getImageData(0,0, EDGE, EDGE)
    const matrix = Array(EDGE).fill(Array(EDGE).fill([0, 0, 0]))
    matrix.forEach((row, rowIndex) => {
      row.forEach((pixel: Array<number>, columnIndex: number) => {
        const beginIndex = (rowIndex * EDGE + columnIndex) * 4
        row[columnIndex] = pixel.map((_, index) => data.data[beginIndex + index] / MAX)
      })
    })
    console.log(matrix)
    const [result] = await (this.state.model.predict(tf.tensor([matrix])) as any).array()
    console.log(result
      .map((v, index) => ({
        index,
        value: v
      }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 5)
    )
  }

  render = () => {
    return (
      <div className={styles.body}>
        {!this.state.model ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon type="loading" style={{ marginRight: '.5rem', fontSize: '1rem' }}/>
            <div>正在加载模型文件</div>
          </div>
        ) : (
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
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className={styles.itemGroup}>
              <Icon type="delete" onClick={this.handleDelete} />
              <Icon type="undo" onClick={this.handleUndo} />
              <Icon type="file" onClick={this.handleUpload}/>
              <Icon type="search" onClick={this.getData} />
            </div>
          </React.Fragment>
        )}

      </div>
    )
  }
}

export default Index
