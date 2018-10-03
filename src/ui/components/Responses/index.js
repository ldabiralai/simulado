import React from 'react';
import List from '@material-ui/core/List';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default ({ data }) => {
  const listItems = data.map(response => (
    <ExpansionPanel key={response.path}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{response.path}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography>{response.status}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Headers</Typography>
              </TableCell>
              <TableCell>
                <Typography>{JSON.stringify(response.headers)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Body</Typography>
              </TableCell>
              <TableCell>
                <Typography>{JSON.stringify(response.body)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Conditional Headers</Typography>
              </TableCell>
              <TableCell>
                <Typography>{JSON.stringify(response.conditionalHeaders)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Conditional Body</Typography>
              </TableCell>
              <TableCell>
                <Typography>{JSON.stringify(response.conditionalBody)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Delay</Typography>
              </TableCell>
              <TableCell>
                <Typography>{JSON.stringify(response.delay)}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));

  return <List style={{ width: '100%' }}>{listItems}</List>;
};
