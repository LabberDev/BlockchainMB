const Wallet	=	require('./wallet');
const wallet	=	new Wallet();

console.log(wallet.toString());


/*
	const Blockchain	=	require('./blockchain');

	const bc			=	new Blockchain();

	const ripetizioni	=	10;

	for (let i=0; i<ripetizioni; i++)
		console.log(bc.addBlock(`numero ${i}`).toString());
*/
	
/*
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
*/