import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import orderBy from "lodash/orderBy";
import SpinnerContainer from './Components/Spinner/SpinnerContainer'
import { connect } from 'react-redux'
import { getPlayers } from './redux/playerReducer'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles({
  tablehead: {
    background: 'rgb(188, 70, 92)'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
  table: {
    minWidth: 650,
  }
});

function App(props) {
  const classes = useStyles();
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('');
  const [columnToSort, setColumnToSort] = useState('')
  const [sortDirection, setSortDirection] = useState('')
  const [isLoading, setLoading] = useState(true);
  const invertDirection = {
    asc: 'desc',
    desc: 'asc'
  }

  useEffect(() => {
    axios.get('https://www.balldontlie.io/api/v1/players')
      .then(res => {
        setPlayers(res.data.data)
        setLoading(!isLoading);
        props.getPlayers(res.data)
      })
      .catch(err => {
        console.log(err)
        setLoading(!isLoading);
      })
  }, [])

  let columnHeads = [
    { id: 'id', label: 'ID#', disableSorting: true },
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'position', label: 'Position', disableSorting: true },
  ]

  const searchPlayers = e => {
    setSearch(e.target.value);
  }

  const handleSort = (columnId) => {
    setColumnToSort(columnId)
    setSortDirection(columnToSort === columnId ? invertDirection[sortDirection] : 'asc')

    if (columnId === 'number') {
      players.sort((a, b) => {
        return new Date(b.id) - new Date(a.id);
      });
    }
  }

  console.log(players)
  return (
    <div className="App">
      <h1>NBA HALL OF ALL PLAYERS EVER</h1>

      {isLoading ? <SpinnerContainer /> :
        <section>
          <TextField onChange={e => searchPlayers(e)} variant="outlined" value={search} />
          <TableContainer className='table-container' component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead className={classes.tablehead}>
                <TableRow>
                  {columnHeads.map(column => (
                    <TableCell
                      key={column.id}
                      align="center"
                    >
                      {column.disableSorting ? (
                        <div>
                          {column.label}
                        </div>
                      ) :
                        <div
                          className='arrow-filter'
                          onClick={() => handleSort(column.id)}>
                          <span title='Sort'>{column.label}</span>
                          {columnToSort === column.id ? (
                            sortDirection === 'asc' ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )
                          ) : null}
                        </div>}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {orderBy(players, columnToSort, sortDirection)
                  .filter(player => (
                    player.first_name.toLowerCase().includes(search.toLowerCase()) || player.last_name.toLowerCase().includes(search.toLowerCase())
                  )).map(player => (
                    <TableRow key={player.id}>
                      <TableCell component="th" scope="row" align="center">
                        {player.id}
                      </TableCell>
                      <TableCell align="center">{player.first_name}</TableCell>
                      <TableCell align="center">{player.last_name}</TableCell>
                      <TableCell align="center">{player.position}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      }

    </div>
  );
}

const mapStateToProps = reduxState => ({
  players: reduxState.playerReducer.players
})

export default connect(mapStateToProps, { getPlayers })(App)