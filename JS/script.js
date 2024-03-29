
const sonic = document.querySelector('.sonic')


const monster = document.querySelector('.monster')


const cloud = document.querySelector('.clouds')


const ring = document.querySelector('.ring')


const contador = document.querySelector('.contador p')


const fp = document.querySelector('.first-page')

const gb = document.querySelector('.game-board')

function runGame() {

    let valor = 0
    let contIncre = false
    let teste
    let onAir
    let isDouble
    let sonicHeight = sonic.clientHeight;
  
    //Setter de variáveis CSS
    function setTranslateY(){
      const currentTransform = getComputedStyle(sonic).transform
      const currentTranslateY = getTranslateY(currentTransform)
      const percentTranslateY = (currentTranslateY/sonicHeight)*100
      document.documentElement.style.setProperty('--current-translateY', `${percentTranslateY}%`)
      document.documentElement.style.setProperty('--target-translateY', `${percentTranslateY-300}%`)
    }

    //Funções de pulo
    function jump() {
        if(!sonic.classList.contains('game-over') && !isDouble){
      sonic.classList.add('jump')
    }
      onAir = true
      setTimeout(() => {
        sonic.classList.remove('jump')
        onAir = false
      }, 700)
    }
    
    //Função de pulo duplo
    function doublejump() {
      setTranslateY()
      sonic.classList.remove('jump')
      sonic.classList.add('doublejump')
      isDouble = true
      setTimeout(() => {
        setTranslateY()
        sonic.classList.add('fall');
        sonic.classList.remove('doublejump')
        isDouble = false;
        setTimeout(() => {
          sonic.classList.remove('fall')
        }, 300)
      }, 500)
    }
  
    let teclaPress = false;

    //Teste se a tecla foi pressionada para pulo
    document.addEventListener('keydown', (event) => {
      if ((event.key === 'ArrowUp' || event.key === 'w') && !onAir) {
        if(!teclaPress){
        jump()
        teclaPress = true
      }
      }
    })
    
    //Testa se a tecla foi liberada, para não ser possível pular de forma contínua
    document.addEventListener('keyup', ()=>{
      teclaPress = false;
    })

    //Testa tecla pressionada para doublejump
    document.addEventListener('keyup', (event) => {
      if (
        event.key === ' ' &&
        onAir &&
        !isDouble
      ) {
        doublejump()
      }
    })

    //Função para colisão com anel
    function checkCollisionRing() {
      const sonicPosition = +window.getComputedStyle(sonic).top.replace('px', '')
      const ringPosition = +window.getComputedStyle(ring).top.replace('px', '')
      const ringLeft = ring.offsetLeft
  
      if (
        sonicPosition >= ringPosition - 80 &&
        sonicPosition <= ringPosition + 80 &&
        ringLeft <= 200 &&
        ringLeft > 0
      ) {
        if (!contIncre) {
            ++valor
            let valorFormatado = valor.toString().padStart(4, '0')
          contador.innerHTML = `${valorFormatado}`
          ring.style.display = 'none'
          contIncre = true
        }
      } else {
        contIncre = false
      }
    }
  

    /*
    const loop = setInterval(() => {
      const monsterPosition = monster.offsetLeft
      const sonicPosition = +window.getComputedStyle(sonic).top.replace('px', '')
      const cloudPosition = cloud.offsetLeft
      const ringPosition = ring.offsetLeft
  
      if ((monsterPosition <= 110 && sonicPosition > 400 && monsterPosition > 0) || (monsterPosition <= 120 && sonicPosition > 430 && monsterPosition > 0)) {
        monster.style.animation = 'none'
        monster.style.left = `${monsterPosition}px`
  
        sonic.classList.add('game-over');

        sonic.style.animation = 'sonic-over 0.5s linear forwards'
        sonic.style.top = `${sonicPosition}px`
  
        cloud.style.animation = 'none'
        cloud.style.left = `${cloudPosition}px`
  
        ring.style.animation = 'ringEnd 0.3s ease forwards'
        setTimeout(() => {
          ring.remove()
        }, 100)
        ring.style.left = `${ringPosition}px`
  
        clearInterval(loop)
        clearInterval(ringReloadInterval)
        document.addEventListener('keyup', (event) => {
          setTimeout(()=>{
            if (event.key === 'ArrowUp') {
            document.location.reload()
          }
        }, 1200)})
        teste = false
      }

      checkCollisionRing()
    }, 10)
    */


    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min)
    }
  
    let ringReloadInterval
  
    function startRingReload() {
      clearInterval(ringReloadInterval)
      ringReloadInterval = setInterval(() => {
        ring.style.top = `${getRandomInt(70, `${gb.offsetHeight-100}`)}px`
        ring.style.display = 'block';
      }, getRandomInt(2000, 3000))
    }
    startRingReload()
  
    ring.addEventListener('animationend', () => {
      ring.style.removeProperty('left')
      ring.style.removeProperty('top')
      ring.style.removeProperty('display')
      ring.style.removeProperty('animation');
  
      if (teste) {
        setTimeout(() => {
          ring.style.animation = 'ring-animation 3s linear forwards'
          startRingReload()
        }, 1000)
      }
    })
  
  //Atualizando funções para clique, para funcionar em mobile, V0.1
  
  //Função de pulo ao clicar
  document.addEventListener('click', ()=>{
    if(!onAir)
    jump()
    else if(onAir && !isDouble)
    doublejump()
  })  
  
  }

  //Função para atualizar o translateY atual e deixar o doublejump funcional
  function getTranslateY(matrix){
    const matrixValues = matrix.split(', ');
    return parseInt(matrixValues[5], 10);
  }

  //Função para ajustar a altura do game-board de acordo com a tela do usuário
  function adjustGameBoardHeight() {
    const gameBoard = document.querySelector('.game-board');
    const screenWidth = window.innerWidth;
  
    if (screenWidth >= 1400) {
      gameBoard.style.height = '80vh';
    } else{
      const reductionFactor = Math.floor((1400 - screenWidth) / 10);
      const adjustedHeight = 70 - (reductionFactor * 0.45);
      gameBoard.style.height = `${adjustedHeight}vh`;
    }
  }

  // Chamar a função quando a página carregar e quando a tela for redimensionada
  window.addEventListener('load', adjustGameBoardHeight);
  window.addEventListener('resize', adjustGameBoardHeight);
  
  //Chama a função para rodar o jogo
  runGame();