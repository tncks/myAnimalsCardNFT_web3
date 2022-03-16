import React, { FC, useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";
import { mintAnimalTokenContract, web3 } from "../web3Config";
import { saleAnimalTokenContract } from "../contracts";

interface SaleAnimalCardProps {
    animalTokenId: string;
    animalType: string;
    animalPrice: string;
    account: string;
    getOnSaleAnimalTokens: () => Promise<void>;
}


const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
    animalTokenId,
    animalType,
    animalPrice,
    account,
    getOnSaleAnimalTokens
}) => {
    const [isBuyable, setIsBuyable] = useState<boolean>(false);

    const getAnimalTokenOwner = async () => {
        try {
            const response = await mintAnimalTokenContract.methods
                .ownerOf(animalTokenId)
                .call();

            setIsBuyable(response.toLocaleLowerCase() === account.toLocaleLowerCase());
            //console.log(account);

        } catch (error) {
            console.error(error);
        }
    };

    const onClickBuy = async () => {
        try {
            if (!account) return;
            const response = await saleAnimalTokenContract.methods
                .purchaseAnimalToken(animalTokenId)
                .send({ from: account, value: animalPrice });

            if(response.status) {
                getOnSaleAnimalTokens();

            }
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAnimalTokenOwner();
    }, []);

    return (
        <Box textAlign="center" w={150}>
            <AnimalCard animalType={animalType} />
            <Box>
                <Text d="inline-block">
                    {web3.utils.fromWei(animalPrice)} Matic
                </Text>                
                <Button size="sm" colorScheme="green" m={2} disabled={isBuyable} onClick={onClickBuy}>
                    Buy
                </Button>
            </Box>
        </Box>
    );
};

export default SaleAnimalCard;