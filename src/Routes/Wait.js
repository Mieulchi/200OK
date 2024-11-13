import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import styles from '../Css/Wait.module.css';

const Wait = () => {
  const navigate = useNavigate();
  const [bIsUploadingSucess, setBIsUploadingSucess] = useState(0);

  useEffect(() => {
    // Phaser 게임 설정
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000, // 배경을 검정색으로 설정
      scene: {
        preload: preload,
        create: create,
      },
    };

    // Phaser 게임 인스턴스 생성
    const game = new Phaser.Game(config);

    function preload() {
      this.load.audio('backgroundMusic', 'Sounds/jungle-background.mp3');
      // PNG 이미지들 로드
      this.load.image('image1', 'crocodile.png');
      this.load.image('image2', 'lizard.png');
      this.load.image('image3', 'jaguar.png');
      this.load.image('image4', 'frog.png');
      this.load.image('image5', 'tucan.png');
    }

    function create() {
      // 배경 음악 재생
      this.sound.play('backgroundMusic', {
        loop: true, // 반복 재생
        volume: 0.5, // 볼륨 조절 (0에서 1 사이)
      });

      // 텍스트를 담을 배열 생성
      const textArray = [
        ' 아마존에는 하늘을 덮는 거대한 나무들이 있답니다! ',
        '아마존에는 세상에서 가장 작은 원숭이가 있답니다?',
        '그거 아시나요? 아마존에는 빛을 내는 생물들이 있답니다! ',
        ' 아마존에는 최고의 의료 약초들이 자생하고 있답니다?',
        ' 아마존에는 사람보다 많은 곤충들이 살고 있답니다? ',
        '아마존에는 세상에서 가장 큰 뱀이 살고 있답니다? ',
        ' 아마존에는 사라진 고대 문명이 숨겨져 있을지도 모른답니다? ',
        '아마존에는 음악을 좋아하는 돌고래들이 있답니다? ',
        '업로드 진행 중...',
      ];
      const text = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        '',
        {
          font: '36px Arial',
          fill: '#FFFFFF',
          align: 'center',
        }
      );

      text.setOrigin(0.5, 0.5);

      // 한 글자씩 타이핑 효과를 주는 함수
      const typeText = (str, callback) => {
        let charIndex = 0;
        text.setText(''); // 텍스트 초기화
        const typeInterval = setInterval(() => {
          text.setText(str.substring(0, charIndex + 1)); // 한 글자씩 추가
          charIndex++;
          if (charIndex === str.length) {
            clearInterval(typeInterval); // 텍스트 완전히 출력되면 인터벌 종료
            callback(); // 텍스트 출력이 끝나면 콜백 실행
          }
        }, 100); // 타이핑 속도 (ms)

        return typeInterval;
      };

      // 배열의 텍스트 중 랜덤한 텍스트를 표시하는 함수
      const showRandomText = () => {
        const randomIndex = Math.floor(Math.random() * textArray.length); // 랜덤 인덱스 선택
        const selectedText = textArray[randomIndex];
        typeText(selectedText, () => {
          // 6초 후 새로운 텍스트 출력 시작
          setTimeout(showRandomText, 6000);
        });
      };

      // 최초 텍스트 표시
      showRandomText();

      // 하단에 이미지 5개 배치 (간격 40px, 크기 줄이기)
      const imageWidth = 80; // 이미지 크기를 줄임
      const gap = 60; // 이미지 간 간격
      const totalWidth = imageWidth * 5 + gap * 4; // 5개의 이미지와 4개의 간격 합산
      const startX = (this.cameras.main.width - totalWidth) / 2; // 화면의 중앙에 맞추기 위한 시작 X 좌표

      // 5개의 이미지 추가 및 애니메이션 설정
      for (let i = 0; i < 5; i++) {
        const image = this.add.image(
          startX + i * (imageWidth + gap),
          window.innerHeight - 100,
          `image${i + 1}`
        );

        image.setScale(0.1); // 이미지 최초 크기 설정

        // 이미지 애니메이션 (커지고 작아지는 애니메이션, 좌측 끝에서 우측 끝으로)
        this.tweens.add({
          targets: image,
          scaleX: 0.2, // 최대 크기 (80%로 커짐)
          scaleY: 0.2, // 최대 크기 (80%로 커짐)
          duration: 2000, // 커지는 시간 (2초)
          rotation: Phaser.Math.DegToRad(45),
          yoyo: true, // 애니메이션 되돌리기 (작아짐)
          repeat: -1, // 무한 반복
          delay: i * 500, // 각 이미지마다 딜레이를 두어 순차적으로 실행되도록
          ease: 'Sine.easeInOut', // 부드러운 애니메이션
        });
      }

      // 컴포넌트 언마운트 시 정리
      return () => {
        game.sound.stopAll(); // 컴포넌트 언마운트 시 음악 정지
        game.destroy(true); // Phaser 게임 인스턴스 완전 종료
      };
    }

    // 업로드 상태 확인
    const checkUploadSuccess = setInterval(() => {
      if (bIsUploadingSucess === 1) {
        // 업로드 성공 시 음악 멈추고 페이지 이동
        game.sound.stopAll(); // 모든 음악을 멈춤
        game.destroy(true); // Phaser 게임 인스턴스를 완전히 종료
        navigate('/game'); // /game 페이지로 이동
        clearInterval(checkUploadSuccess); // 반복문 종료
      }
    }, 500);

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearInterval(checkUploadSuccess); // 인터벌 제거
      //game.sound.stopAll();  // 컴포넌트 언마운트 시 음악 정지
      game.destroy(true); // 게임 인스턴스 종료
    };
  }, [bIsUploadingSucess, navigate]);

  // 10초 후 업로드 성공 상태 변경 (예시)
  useEffect(() => {
    const timer = setTimeout(() => {
      setBIsUploadingSucess(1); // 업로드 성공 상태 변경
    }, 10000); // 10초 후 상태 변경 (예시)

    return () => clearTimeout(timer); // 타이머 클린업
  }, []);

  return <div id="game-container" className={styles.gameContainer}></div>;
};

export default Wait;
