import { useState, useEffect } from 'react'
import { Button, Card, Typography } from 'antd'
import { GameState } from '../entities/GameState'

const { Title, Text } = Typography

function BalloonClicker() {
  const [score, setScore] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [balloonAnimation, setBalloonAnimation] = useState('')
  const [gameStateId, setGameStateId] = useState(null)

  useEffect(() => {
    loadGameState()
  }, [])

  const loadGameState = async () => {
    try {
      const response = await GameState.list()
      if (response.success && response.data.length > 0) {
        const gameData = response.data[0]
        setScore(gameData.score || 0)
        setTotalClicks(gameData.totalClicks || 0)
        setHighScore(gameData.highScore || 0)
        setGameStateId(gameData._id)
      } else {
        const newGameState = await GameState.create({
          userId: 1,
          score: 0,
          totalClicks: 0,
          highScore: 0
        })
        if (newGameState.success) {
          setGameStateId(newGameState.data._id)
        }
      }
    } catch (error) {
      console.error('Failed to load game state:', error)
    }
  }

  const saveGameState = async (newScore, newTotalClicks, newHighScore) => {
    if (!gameStateId) return
    
    try {
      await GameState.update(gameStateId, {
        userId: 1,
        score: newScore,
        totalClicks: newTotalClicks,
        highScore: newHighScore
      })
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  }

  const handleBalloonClick = () => {
    const newScore = score + 1
    const newTotalClicks = totalClicks + 1
    const newHighScore = Math.max(highScore, newScore)
    
    setScore(newScore)
    setTotalClicks(newTotalClicks)
    setHighScore(newHighScore)
    
    setBalloonAnimation('animate-bounce')
    setTimeout(() => setBalloonAnimation(''), 200)
    
    saveGameState(newScore, newTotalClicks, newHighScore)
  }

  const resetScore = async () => {
    setScore(0)
    if (gameStateId) {
      await saveGameState(0, totalClicks, highScore)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-white mb-2">🎈 Balloon Clicker Game</Title>
          <Text className="text-blue-100 text-lg">Click the balloon to pop it and earn points!</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-white/90 backdrop-blur-sm">
            <Title level={3} className="text-blue-600 mb-1">Current Score</Title>
            <Title level={2} className="text-3xl font-bold text-gray-800">{score}</Title>
          </Card>
          
          <Card className="text-center bg-white/90 backdrop-blur-sm">
            <Title level={3} className="text-purple-600 mb-1">High Score</Title>
            <Title level={2} className="text-3xl font-bold text-gray-800">{highScore}</Title>
          </Card>
          
          <Card className="text-center bg-white/90 backdrop-blur-sm">
            <Title level={3} className="text-green-600 mb-1">Total Clicks</Title>
            <Title level={2} className="text-3xl font-bold text-gray-800">{totalClicks}</Title>
          </Card>
        </div>

        <div className="text-center mb-8">
          <div 
            className={`inline-block cursor-pointer transition-transform hover:scale-110 ${balloonAnimation}`}
            onClick={handleBalloonClick}
          >
            <div className="text-9xl sm:text-[12rem] md:text-[16rem] select-none">
              🎈
            </div>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Button 
            type="primary" 
            size="large"
            onClick={handleBalloonClick}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
          >
            Pop the Balloon! 🎈
          </Button>
          
          <Button 
            type="default" 
            size="large"
            onClick={resetScore}
            className="bg-white/90 hover:bg-white border-gray-300"
          >
            Reset Score
          </Button>
        </div>

        <div className="text-center mt-8">
          <Text className="text-blue-100">
            Tip: You can click the balloon emoji or use the button below it!
          </Text>
        </div>
      </div>
    </div>
  )
}

export default BalloonClicker