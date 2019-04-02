import React from 'react';
import CanvasDraw from "react-canvas-draw"
import styles from './index.css';
import { Icon, Modal, Tooltip } from 'antd'
const EDGE = 299
class Index extends React.Component {
  state = {
    imageSrc: null,
    key: new Date().valueOf(),
    imgs: [],
    loading: false
  }
  canvas: any = null

  handleDelete = () => {
    this.canvas.clear()
    this.canvas.ctx.drawing.fillStyle = '#fff'
    this.canvas.ctx.drawing.fillRect(0, 0, EDGE, EDGE)
  }

  handleSelect = (show = true) => {
    this.setState({ showModal: show })
  }

  handleSelectImg = async (url) => {
    const blob = await fetch(url).then(res => res.blob())

    const fr = new FileReader()
    fr.onload = (e) => {
      const result = (e.target as any).result
      const image = new Image()
      image.src = result
      image.style.display = "none"
      image.onload = () => {
        this.canvas.ctx.drawing.drawImage(image, 0, 0, EDGE, EDGE)
        document.body.removeChild(image)
        this.setState({ showModal: false })
      }
      document.body.appendChild(image)
    }
    fr.readAsDataURL(blob)

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
        try {
          this.canvas.ctx.drawing.fillStyle = '#fff'
          this.canvas.ctx.drawing.fillRect(0, 0, EDGE, EDGE)
        } catch (e) {
        }
      }, 1000)
    }


  }

  getData = async () => {
    if (this.canvas == null) { return }
    const data: ImageData = this.canvas.ctx.drawing.getImageData(0,0, EDGE, EDGE)
    this.setState({ loading: true })
    fetch('http://218.94.159.108:12345', {
      method: 'POST',
      body: JSON.stringify(Array.from(data.data.filter((_,index) => index % 4 != 3)))
    }).then(res => res.text()).then(text => {
      const imgs = text.replace('{"data": ', '').replace('}', '').split(',').slice(0,10)
      this.setState({ imgs, loading: false })
    })
  }

  render = () => {
    return (
      <>
        <div className={styles.modal}>
          {Array(14).fill(0).map((_, index) => (
            <Tooltip title="select me and click search button to see the result">
              <img 
                src={`http://218.94.159.108:16778/static/example/${index + 1}.png`} 
                onClick={this.handleSelectImg.bind(this, `http://218.94.159.108:16778/static/example/${index + 1}.png`)}
              />
            </Tooltip>
          ))}
        </div>
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
              {this.state.imgs.length > 0 ? (
                <>
                  <div>
                    <div style={{ fontSize: 16, width: 180 }}>retrieval results with ensemble<br/>（three models）</div>
                    {this.state.imgs.slice(0,5).map(v => <img src={`http://218.94.159.108:16778/static/photo/${v}`} key={v} />)}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, width: 180 }}>retrieval results without ensemble<br/>（single model）</div>
                    {this.state.imgs.slice(5,10).map(v => <img src={`http://218.94.159.108:16778/static/photo/${v}`} key={v} />)}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 20 }}>
                  {this.state.loading ? 
                    <span><Icon type="loading" style={{ marginRight: 20 }}/>loading result, please wait...</span>
                  : 'please select an image, or draw a sketch, or upload one by tools from left-bottom'}
                </div>
              )}

            </div>
            <div className={styles.itemGroup}>
              <Tooltip title="clear" >
                <Icon type="delete" onClick={this.handleDelete} />
              </Tooltip>
              <Tooltip title="upload a sketch" >
                <Icon type="file" onClick={this.handleUpload}/>
              </Tooltip>
              <Tooltip title="begin to search" >
                <Icon type="search" onClick={this.getData} />
              </Tooltip>
            </div>
          </React.Fragment>
      </div>
      </>
    )
  }
}

export default Index
