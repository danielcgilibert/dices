import { socket } from '@/socket'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [player1Dice, setPlayer1Dice] = useState(0)
  const [player2Dice, setPlayer2Dice] = useState(0)
  const [game, setGame] = useState([
    [
      [0, 0, 0],
      [5, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  ])
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [messages, setMessages] = useState<String[]>([])

  const handleRoll = () => Math.floor(Math.random() * 6) + 1

  const setNumberDice = (
    player: number,
    number: number,
    indexRow: number,
    indexCell: number
  ) => {
    if (player === 1) {
      setPlayer1Dice(number)
      game.map((player, indexPlayer) => {
        console.log(player)
      })
    }

    if (player === 2) {
      setPlayer2Dice(number)
    }
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }
    const receiveMessage = (message: string) => {
      console.log(message)
      setMessages([message, ...messages])
    }
    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('message', receiveMessage)
    socket.on('disconnect', onDisconnect)
    socket.emit('new-message', 'message from frontend')

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  return (
    <main
      className={`grid place-content-center min-h-screen text-center ${inter.className}`}>
      <h1 className="text-4xl font-bold mb-5">Dices</h1>
      <div className="flex">
        <div className="border-2 mb-auto p-5">dado {player1Dice}</div>
        <div className="grid gap-5 text-center">
          {game.map((player, indexPlayer) => (
            <div key={indexPlayer}>
              <h1 className="mb-5">Player {indexPlayer + 1}</h1>

              {player.map((row, indexRow) => (
                <>
                  <div className="flex gap-5 " key={indexPlayer}>
                    {row.map((cell, indexCell) => (
                      <div
                        onClick={() => {
                          setNumberDice(
                            indexPlayer + 1,
                            handleRoll(),
                            indexRow,
                            indexCell
                          )
                          console.log(player1Dice)
                        }}
                        className="cursor-pointer hover:bg-slate-500 w-28 h-24 border-2 flex justify-center items-center m-1"
                        key={indexCell}>
                        {cell}
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          ))}
        </div>
        <div className="border-2  p-5 mt-auto">dado {player2Dice}</div>
      </div>

      <button onClick={handleRoll} className="border-2 p-4 mt-5">
        Start Game
      </button>
    </main>
  )
}
