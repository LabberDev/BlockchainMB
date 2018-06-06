const Block	=	require('./block');

runBlockchain(3);

function runBlockchain(numRipetizioni)
{
	const genesisBlock	=	Block.mineBlock(Block.genesis(), 'genesisBlock');
	console.log(genesisBlock.toString());

	var nBlock	=	genesisBlock;

	for (var i = 0;	i < numRipetizioni;	i++)
	{
		nBlock	=	Block.mineBlock(nBlock, i);
		console.log(nBlock.toString());
	}
}