import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Gallery,
  GalleryItem,
  PageGroup,
  PageSection,
  Text,
  Title,
} from '@patternfly/react-core'
import { TableComposable, Tbody, Td, Thead, Tr } from '@patternfly/react-table'
import React, { useEffect, useState } from 'react'
import { log, pluginTitle } from './globals'

export const RemotePlugin: React.FunctionComponent = () => {
  const [reset, setReset] = useState(false)
  return (
    <>
      <PageGroup>
        <PageSection variant='light'>
          <Title headingLevel='h1'>{pluginTitle}</Title>
          <Text component='small'>
            A sample Hawtio plugin that is hosted on an external site and is discovered dynamically at runtime.
          </Text>
        </PageSection>
      </PageGroup>
      <PageSection>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          <GalleryItem>
            <Card>
              <CardTitle>Tic-Tac-Toe</CardTitle>
              <CardBody>
                <Game reset={reset} setReset={setReset} />
              </CardBody>
              <CardFooter>
                <Button variant='primary' onClick={() => setReset(true)}>
                  Reset Game
                </Button>
              </CardFooter>
            </Card>
          </GalleryItem>
        </Gallery>
      </PageSection>
    </>
  )
}

const Game: React.FC<{ reset: boolean; setReset: (reset: boolean) => void }> = ({ reset, setReset }) => {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
  const [next, setNext] = useState<'X' | 'O'>('X')

  useEffect(() => {
    if (reset) {
      setSquares(Array(9).fill(''))
      setNext('X')
      setReset(false)
    }
  }, [reset, setReset])

  const handlePlay = (squares: string[]) => {
    setSquares(squares)
    setNext(next === 'X' ? 'O' : 'X')
  }

  const winner = calculateWinner(squares)
  const status = winner ? `🎉 Winner: ${winner}` : `Next → ${next}`

  return (
    <>
      <Board next={next} squares={squares} onPlay={handlePlay} />
      <br />
      <Alert variant={winner ? 'success' : 'info'} isInline title={status} />
    </>
  )
}

function calculateWinner(squares: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  const line = lines.find(([a, b, c]) => squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
  return line ? squares[line[0]] : null
}

const Board: React.FC<{ next: 'X' | 'O'; squares: string[]; onPlay: (squares: string[]) => void }> = ({
  next,
  squares,
  onPlay,
}) => {
  const handleClick = (n: number) => () => {
    log.info('Clicked', n, squares)
    if (calculateWinner(squares) || squares[n]) return
    const nextSquares = [...squares]
    nextSquares[n] = next
    onPlay(nextSquares)
  }

  return (
    <TableComposable variant='compact'>
      <Thead>
        <Tr></Tr>
      </Thead>
      <Tbody>
        <Tr>
          {[0, 1, 2].map(n => (
            <Square key={n} value={squares[n]} onClick={handleClick(n)} />
          ))}
        </Tr>
        <Tr>
          {[3, 4, 5].map(n => (
            <Square key={n} value={squares[n]} onClick={handleClick(n)} />
          ))}
        </Tr>
        <Tr>
          {[6, 7, 8].map(n => (
            <Square key={n} value={squares[n]} onClick={handleClick(n)} />
          ))}
        </Tr>
      </Tbody>
    </TableComposable>
  )
}

const Square: React.FC<{ value: string; onClick: () => void }> = ({ value, onClick }) => {
  return (
    <Td
      width={10}
      hasLeftBorder
      hasRightBorder
      onClick={onClick}
      style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
    >
      {value ? value : ' '}
    </Td>
  )
}
