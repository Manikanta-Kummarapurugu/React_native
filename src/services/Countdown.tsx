import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"

const countdownCircleTimer = () => (
    <CountdownCircleTimer
    isPlaying
    duration={7}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
  >
    {({ remainingTime }) => <Text>{remainingTime}</Text>}
  </CountdownCircleTimer>
  )

  export default countdownCircleTimer;
