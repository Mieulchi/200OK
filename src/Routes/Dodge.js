import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';

const Dodge = () => {
  const [game, setGame] = useState(null);

  const [timeLeft, setTimeLeft] = useState(30);
  const [water, setWater] = useState(5);
  const [food, setFood] = useState(5);
  const [rectangleY, setRectangleY] = useState(0); // Y 좌표 상태
  const [gameStarted, setGameStarted] = useState(false);
  const [timerEvent, setTimerEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scale: {
        mode: Phaser.Scale.ENVELOP, // 화면을 완전히 채우도록 조정
        autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙에 배치
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: 'phaser-game-container',
    };

    const gameInstance = new Phaser.Game(config);
    setGame(gameInstance);

    return () => {
      gameInstance.destroy(true);
      if (timerEvent) {
        timerEvent.remove();
      }
    };
  }, []);

  const preload = function () {
    this.load.image('player', 'player.png');
    this.load.image('bullet', 'trash.png');
    this.load.image('background', 'galaxy.png');
    this.load.image('World', 'World.jpeg');
    this.load.image('rocket', 'explosion.png');
    this.load.image('box', 'box.png');
    this.load.image('waterI', 'water.png');
    this.load.image('foodI', 'food.png');
    this.load.image('flame', 'BulletEffect.png');
    this.load.image('parachute', 'parachute.png'); // 낙하산 이미지 로드
    this.load.image('cursor', 'cursor.png');
    this.load.image('check', 'check.png');
    this.load.audio('hitSound', 'Sounds/HitPlayer.mp3');
    this.load.audio('Click', 'Sounds/Click.mp3');
    this.load.audio('backgroundMusic', 'Sounds/background-music.mp3');
    this.load.audio('PlayerComing', 'Sounds/PlayerComing.mp3');
    this.load.audio('PlayerDie', 'Sounds/playerdie.mp3');
    this.load.audio('PlayerFall', 'Sounds/playerfall.mp3');
    this.load.image('rectangleImage', 'player.png');

    this.registry.set('water', 5); // water 초기 값 5
    this.registry.set('food', 5); // food 초기 값 5
  };

 


 

    
  const create = function () {
    this.timeLeft = 30;
    this.background1 = this.add
      .image(400, 300, 'background')
      .setOrigin(0.5, 0.5);
    this.background2 = this.add
      .image(400, 900, 'background')
      .setOrigin(0.5, 0.5);
      this.movingRectangle = this.add
      .image(760, 150, 'rectangleImage') // PNG 이미지 사용
      .setOrigin(0.5, 0.5)
      .setScale(0.05)
      .setDepth(1);
// 텍스트 추가
// 텍스트 추가 (크기 줄임)
// 텍스트 추가 (크기 줄임)
// 기준 위치 (고도 가로선의 새로운 Y 좌표)
// 기준 위치 (고도 가로선의 새로운 Y 좌표)
// 기준 위치 (고도 가로선의 새로운 Y 좌표)
// 기준 위치 (고도 가로선의 새로운 Y 좌표)
const altitudeLineY = 150; // "고도" 가로선 기준 위치
const offsetX = 30; // 우측으로 이동할 거리
const earthLineY = altitudeLineY + 150; // "지구" 가로선 기준 위치
const numHorizontalLines = 10; // 추가할 가로선 개수
const lineSpacing = (earthLineY - altitudeLineY) / (numHorizontalLines + 1); // 간격 계산
const fullLineWidth = 40; // "고도"와 "지구" 가로선 길이
const minLineWidth = 5; // 가장 짧은 가로선 길이 (줄어드는 폭 증가)
const maxLineWidth = fullLineWidth / 2; // 가장 긴 가로선 길이

this.rocketImage = this.add
.image(700+50 + offsetX, altitudeLineY , 'rocket') // 'rocket' 이미지를 로드한 키 사용
.setOrigin(1, 0.5) // 우측 정렬
.setScale(0.02); // 크기 조정
/*
// 텍스트 추가 (Y 좌표를 조금 더 위로 올림)
this.altitudeText = this.add.text(720 + offsetX, altitudeLineY - 20, '출발', {
  font: '15px Arial', // 텍스트 크기를 절반으로 줄임
  fill: '#ffffff', // 텍스트 색상
  align: 'right',
});
this.altitudeText.setOrigin(1, 0); // 우측 정렬
*/

this.earthText = this.add.text(720 + offsetX, earthLineY - 20, '대기권 진입', {
  font: '15px Arial', // 텍스트 크기를 절반으로 줄임
  fill: '#ffffff', // 텍스트 색상
  align: 'right',
});
this.earthText.setOrigin(1, 0); // 우측 정렬

// 그래픽 선 추가
this.lineGraphics = this.add.graphics();
this.lineGraphics.lineStyle(1, 0xffffff, 1); // 선 두께를 줄임

// 세로선
this.lineGraphics.beginPath();
this.lineGraphics.moveTo(730 + offsetX, altitudeLineY); // "고도" 텍스트 아래 시작점
this.lineGraphics.lineTo(730 + offsetX, earthLineY); // "지구" 텍스트 위 끝점
this.lineGraphics.strokePath(); // 선 그리기

// "고도" 텍스트 아래의 가로선 (기존 길이 유지)
this.lineGraphics.beginPath();
this.lineGraphics.moveTo(720 + offsetX - fullLineWidth / 2, altitudeLineY); // 왼쪽으로 절반 길이
this.lineGraphics.lineTo(720 + offsetX + fullLineWidth / 2, altitudeLineY); // 오른쪽으로 절반 길이
this.lineGraphics.strokePath();

// "지구" 텍스트 위의 가로선 (기존 길이 유지)
this.lineGraphics.beginPath();
this.lineGraphics.moveTo(720 + offsetX - fullLineWidth / 2, earthLineY); // 왼쪽으로 절반 길이
this.lineGraphics.lineTo(720 + offsetX + fullLineWidth / 2, earthLineY); // 오른쪽으로 절반 길이
this.lineGraphics.strokePath();

// 추가 가로선 (10개, 중앙 기준으로 길이 조정)
const midIndex = Math.ceil(numHorizontalLines / 2); // 중앙 인덱스 계산
for (let i = 1; i <= numHorizontalLines; i++) {
  const y = altitudeLineY + i * lineSpacing; // 각 가로선의 Y 좌표 계산

  // 길이 계산 (위에서 중앙까지 줄어드는 폭 증가, 중앙부터 아래로 길어짐)
  const isUpperHalf = i <= midIndex; // 현재 선이 상반부인지 확인
  const progress = isUpperHalf
    ? i / midIndex // 상반부: 진행률
    : (i - midIndex) / (numHorizontalLines - midIndex); // 하반부: 진행률
  const lineWidth = isUpperHalf
    ? maxLineWidth - (maxLineWidth - minLineWidth) * Math.pow(progress, 1.5) // 줄어드는 폭 증가
    : minLineWidth + (maxLineWidth - minLineWidth) * Math.pow(progress, 1.5); // 길어지는 폭 증가

  // 중앙 정렬 유지하며 가로선 그리기
  this.lineGraphics.beginPath();
  this.lineGraphics.moveTo(730 + offsetX - lineWidth / 2, y); // 왼쪽으로 절반 길이
  this.lineGraphics.lineTo(730 + offsetX + lineWidth / 2, y); // 오른쪽으로 절반 길이
  this.lineGraphics.strokePath();
}




      
    


    // 블랙 스크린 추가 (배경 위에)
    this.blackScreen = this.add
      
      .rectangle(400, 300, 800, 600, 0x000000)
      .setOrigin(0.5, 0.5);
    this.blackScreen.setAlpha(1); // 처음에는 완전 불투명

    this.sound.volume = 0.04;
    this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });

    // 블랙 스크린 페이드 아웃 애니메이션
    this.tweens.add({
      targets: this.blackScreen,
      alpha: 0,
      duration: 2000, // 페이드 아웃 시간
      ease: 'Linear',
      onComplete: () => {
        this.blackScreen.destroy(); // 페이드 아웃 후 블랙 스크린 제거
        this.player.setPosition(-50, 300); // 화면 밖에 플레이어 위치 설정
        this.player.setAlpha(0); // 초기 알파를 0으로 설정하여 보이지 않게 함

        // 카메라 줌 인
        this.cameras.main.setZoom(2); // 초기 줌 인
        const Sound = this.sound.add('PlayerComing'); // 로드한 'hitSound'를 불러오기

        this.tweens.add({
          targets: this.player,
          alpha: 1, // 애니메이션 동안 알파를 1로 변경하여 보이게 함
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            // 중앙으로 이동

            Sound.play(); // 효과음 재생
            this.tweens.add({
              targets: this.player,
              x: 400, // 중앙으로 이동
              duration: 1000, // 애니메이션 지속 시간
              ease: 'Power2',
              onComplete: () => {
                // 카메라 줌 아웃
                this.tweens.add({
                  targets: this.cameras.main,
                  zoom: 1, // 원래 크기로 줌 아웃
                  duration: 1000, // 줌 아웃 애니메이션 지속 시간
                  ease: 'Power2',
                  onComplete: () => {
                    startGame.call(this); // 줌 아웃 애니메이션 후 게임 시작
                  },
                });
              },
            });
          },
        });
      },
    });

    // 플레이어 생성 (화면 밖에 위치)
    this.player = this.physics.add
      .image(-50, 300, 'player')
      .setCollideWorldBounds(true)
      .setScale(0.06)
      .setAlpha(0);
    this.player.setDrag(100);
    this.bullets = this.physics.add.group();
    this.boxes = this.physics.add.group();
    this.waters = this.physics.add.group();
    this.foods = this.physics.add.group();
    this.cursor = this.add
      .image(0, 0, 'cursor')
      .setOrigin(0.5, 0.5)
      .setScale(0.05); // 크기 조정
    this.cursor.setDepth(1); // 커서를 다른 요소들 위에 표시

    this.input.on('pointermove', (pointer) => {
      this.cursor.setPosition(pointer.x, pointer.y);
    });

    // 커서 숨기기
    this.input.setDefaultCursor('none');

    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        const hitSound = this.sound.add('Click'); // 로드한 'hitSound'를 불러오기
        hitSound.play(); // 효과음 재생
        const targetX = pointer.x;
        const targetY = pointer.y;
        this.physics.moveTo(this.player, targetX, targetY, 200); // 속도 설정 (200)

        // 목표 지점까지의 각도 계산
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          targetX,
          targetY
        );

        // 플레이어의 회전값을 목표 지점의 각도에 맞게 설정 (rad -> deg)
        this.player.rotation = angle;
        const check = this.add
          .image(targetX, targetY, 'check')
          .setOrigin(0.5, 0.5)
          .setScale(0);
        this.tweens.add({
          targets: check,
          scale: 0.02, // 스케일을 1로 증가
          duration: 250, // 0.25초 동안 증가
          ease: 'Linear',
          yoyo: true, // 다시 줄어들게
          onComplete: () => {
            check.destroy(); // 애니메이션이 끝나면 이미지 제거
          },
        });
      }
    });

    this.physics.add.collider(this.player, this.bullets, hitBullet, null, this);
    this.physics.add.overlap(this.boxes, this.bullets, null, null, this);
    this.physics.add.collider(
      this.boxes,
      this.physics.world.bounds.bottom,
      (box) => {
        box.destroy();
      }
    );
    this.physics.add.overlap(this.waters, this.bullets, null, null, this);
    this.physics.add.collider(
      this.waters,
      this.physics.world.bounds.bottom,
      (box) => {
        box.destroy();
      }
    );
    this.physics.add.overlap(this.foods, this.bullets, null, null, this);
    this.physics.add.collider(
      this.foods,
      this.physics.world.bounds.bottom,
      (box) => {
        box.destroy();
      }
    );
  };
 

  
  const createBullet = function () {
    const sides = ['top', 'left', 'right', 'bottom'];
    const choices = [1, 1, 1, 1, 1, 2];
    const bulletCount = Phaser.Math.RND.pick(choices);

    for (let i = 0; i < bulletCount; i++) {
      const side = Phaser.Math.RND.pick(sides);
      let x, y;

      switch (side) {
        case 'top':
          x = Phaser.Math.Between(0, 800);
          y = 0;
          break;
        case 'left':
          x = 0;
          y = Phaser.Math.Between(0, 600);
          break;
        case 'right':
          x = 800;
          y = Phaser.Math.Between(0, 600);
          break;
        case 'bottom':
          x = Phaser.Math.Between(0, 800);
          y = 600;
          break;
      }

      const bullet = this.bullets.create(x, y, 'bullet');
      bullet.setScale(0.02);
      const angle = Phaser.Math.Angle.Between(
        x,
        y,
        this.player.x,
        this.player.y
      );
      bullet.setVelocity(Math.cos(angle) * 50, Math.sin(angle) * 50);

      const createFlame = () => {
        const flame = this.add
          .image(bullet.x, bullet.y, 'flame')
          .setScale(0.04);
        this.tweens.add({
          targets: flame,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            flame.destroy();
          },
        });
      };

      this.time.addEvent({
        delay: 200, // 0.2초마다 불꽃 생성
        callback: () => {
          if (bullet.active) {
            createFlame();
          }
        },
        loop: true,
      });
      if (this.movingRectangle) {
        this.time.addEvent({
          delay: 1000, // 0.05초마다 이동
          callback: () => {
            if (bullet.active) {
              this.movingRectangle.y += 0.2; // Y 좌표를 증가시킴
            }
          },
          loop: true,
        });
      }
    }
  };

  const hitBullet = function (player, bullet) {
    this.cameras.main.shake(200, 0.02); // 화면 흔들기
    const hitSound = this.sound.add('hitSound'); // 로드한 'hitSound'를 불러오기
    hitSound.play(); // 효과음 재생
    // 랜덤으로 Water 또는 Food 중 하나를 감소시킴
    const randomChoice = Math.random() < 0.5 ? 'w' : 'f'; // 50% 확률로 Water 또는 Food

    let water = this.registry.get('water');
    let food = this.registry.get('food');

    if (randomChoice === 'w') {
      dropWater.call(this);
      water = Math.max(water - 1, 0); // water 감소
      this.registry.set('water', water); // 상태 값 업데이트

      setWater(water);
    } else {
      dropFood.call(this);
      food = Math.max(food - 1, 0); // food 감소
      this.registry.set('food', food); // 상태 값 업데이트
      setFood(food);
    }
    if (water <= 0 && food <= 0) {
      endGame.call(this);
    }

    bullet.destroy(); // 총알 제거
  };

  const dropWater = function () {
    const waterI = this.waters.create(this.player.x, this.player.y, 'waterI');
    waterI.setScale(0.03);
    waterI.setGravityY(200);
  };

  const dropFood = function () {
    const foodI = this.foods.create(this.player.x, this.player.y, 'foodI');
    foodI.setScale(0.03);
    foodI.setGravityY(200);
  };

  const endGame = function () {
    console.log(
      `water:${this.registry.get('water')} food:${this.registry.get('food')}`
    );
    const dieSound = this.sound.add('PlayerDie'); // 로드한 'hitSound'를 불러오기
    dieSound.play(); // 효과음 재생
    setGameStarted(false);
    this.bullets.clear(true, true);
    this.boxes.clear(true, true);
    this.waters.clear(true, true);
    this.foods.clear(true, true);
    this.backgroundMusic.stop();

    let initialY = this.player.y;

    // 우측 상단으로 이동하는 애니메이션
    this.tweens.add({
      targets: this.player,
      x: this.player.x + 200,
      y: initialY - 200,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        const fallSound = this.sound.add('PlayerFall');
        fallSound.play(); // 효과음 재생

        this.tweens.add({
          targets: this.player,
          y: initialY - 50,
          duration: 500,
          ease: 'Linear',
          onComplete: () => {
            this.physics.pause(); // 물리 엔진 정지

            this.cameras.main.setZoom(1);
            this.tweens.add({
              targets: this.cameras.main,
              zoom: 1.5,
              duration: 1000,
              ease: 'Power2',
            });

            // 새로운 배경 생성
            this.newBackground1 = this.add
              .image(400, 900, 'World')
              .setOrigin(0.5, 0.5)
              .setScale(1.5);
            this.newBackground2 = this.add
              .image(400, 1500, 'World')
              .setOrigin(0.5, 0.5)
              .setScale(1.5);
            this.newBackground3 = this.add
              .image(400, 2100, 'World')
              .setOrigin(0.5, 0.5)
              .setScale(1.5);
            this.newBackground1.setDepth(0);
            this.newBackground2.setDepth(0);
            this.newBackground3.setDepth(0);
            this.player.setDepth(1);

            // 배경 스크롤 효과
            this.time.addEvent({
              delay: 50,
              callback: () => {
                this.newBackground1.y -= 5;
                this.newBackground2.y -= 5;
                this.newBackground3.y -= 5;

                // 위치 초기화
                if (
                  this.newBackground1.y < -this.newBackground1.displayHeight
                ) {
                  this.newBackground1.y =
                    this.newBackground3.y + this.newBackground1.displayHeight;
                }
                if (
                  this.newBackground2.y < -this.newBackground2.displayHeight
                ) {
                  this.newBackground2.y =
                    this.newBackground1.y + this.newBackground2.displayHeight;
                }
                if (
                  this.newBackground3.y < -this.newBackground3.displayHeight
                ) {
                  this.newBackground3.y =
                    this.newBackground2.y + this.newBackground3.displayHeight;
                }
              },
              loop: true,
            });

            const blackScreen = this.add.graphics({
              fillStyle: { color: 0x000000 },
            });
            blackScreen.fillRect(0, 0, 800, 600);
            blackScreen.setAlpha(0);

            this.time.addEvent({
              delay: 6000, // 6초 후
              callback: () => {
                this.tweens.add({
                  targets: blackScreen,
                  alpha: 1, // 완전히 보이도록 설정
                  duration: 2000, // 2초 동안 애니메이션
                  ease: 'Linear', // 선형 애니메이션
                  onComplete: () => {
                    let waterprop = this.registry.get('water');
                    let foodprop = this.registry.get('food');
                    navigate('/maingametutorial', {
                      state: { water: waterprop, food: foodprop },
                    }); // 종료 후 이동
                  },
                });
              },
            });

            // 낙하산 생성 및 플레이어 천천히 아래로 이동
            const parachute = this.add
              .image(this.player.x, this.player.y - 50, 'parachute')
              .setOrigin(0.5, 0.5)
              .setScale(0.2);

            this.time.addEvent({
              delay: 2000,
              callback: () => {
                this.tweens.add({
                  targets: this.player,
                  y: initialY + 500,
                  duration: 3000,
                  ease: 'Power2',
                  onUpdate: () => {
                    parachute.x = this.player.x;
                    parachute.y = this.player.y - 50;
                  },
                });
              },
            });
          },
        });
      },
    });

    if (timerEvent) {
      timerEvent.remove();
    }
    this.time.removeAllEvents();
  };

  const update = function () {
    // 배경 이동
    this.background1.y += 5;
    this.background2.y += 5;
    
    if (this.background1.y > 600) {
      this.background1.y = this.background2.y - 600;
    }
    if (this.background2.y > 600) {
      this.background2.y = this.background1.y - 600;
    }
  
    // React 상태에 따라 사각형 Y 좌표 업데이트
   
  
    if (timeLeft <= 0) {
      endGame.call(this); // timeLeft가 0이 되면 게임 종료
    }
  };
  
  const startGame = function () {
    this.backgroundMusic.play();
    setGameStarted(true);
  
    // 총알 생성 이벤트
    this.time.addEvent({
      delay: 600, // 총알 생성 주기
      callback: createBullet,
      callbackScope: this,
      loop: true,
    });
  
    // 타이머 이벤트
    const event = this.time.addEvent({
      delay: 1000, // 1초마다
      callback: () => {
        // Phaser의 타이머를 통해 React 상태값 업데이트
        setTimeLeft((prevTime) => {
          const newTime = prevTime <= 1 ? 0 : prevTime - 1;
          
          // React 상태값에 맞게 Y좌표 업데이트
          setRectangleY(newTime * 5);
  
          if (newTime === 0) {
            endGame.call(this); // 시간 다 되면 게임 종료
          }
  
          return newTime;
        });
      },
      loop: true,
    });
    setTimerEvent(event); // 타이머 이벤트를 React 상태에 저장
  };
  

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // 세로 방향 정렬
        alignItems: 'center', // 가로 정렬 (중앙 정렬)
        justifyContent: 'space-between', // 위아래로 공간 분배
        height: '100vh',
        backgroundColor: 'green',
      }}
    >
      <div
        id="phaser-game-container"
        style={{
          width: '100%',
          height: '100vh',
          position: 'relative',
        }}
      >
        {/* 물/음식 정보 */}
        <div
          style={{
            position: 'absolute',
            bottom: '2%',
            left: '50%', // 화면 가로 중앙
            transform: 'translateX(-50%)', // 가로 중앙 정렬
            fontSize: '40px',
            width: '15%',
            color: 'white',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '5px',
            textAlign: 'center',
          }}
        >
          <img
            src="/water.png"
            style={{ width: '40px', height: '40px', verticalAlign: 'middle' }}
          />
          : {`${water}   `}
          <img
            src="/food.png"
            style={{ width: '40px', height: '40px', verticalAlign: 'middle' }}
          />
          : {food}
        </div>
      </div>
    </div>
  );
};  

export default Dodge;
