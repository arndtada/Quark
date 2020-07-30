package vazkii.quark.base.handler;

import java.util.HashMap;
import java.util.Map;

import net.minecraft.block.Block;
import net.minecraft.block.SlabBlock;
import net.minecraft.block.material.Material;
import net.minecraft.item.Item;
import net.minecraftforge.event.furnace.FurnaceFuelBurnTimeEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod.EventBusSubscriber;
import net.minecraftforge.registries.ForgeRegistries;
import vazkii.quark.base.Quark;
import vazkii.quark.building.block.VerticalSlabBlock;

@EventBusSubscriber(modid = Quark.MOD_ID)
public class FuelHandler {

	private static Map<Item, Integer> fuelValues = new HashMap<>();

	public static void addFuel(Item item, int fuel) {
		if(fuel > 0)
			fuelValues.put(item, fuel);
	}

	public static void addFuel(Block block, int fuel) {
		addFuel(block.asItem(), fuel);
	}

	public static void addWood(Block block) {
		if(block instanceof VerticalSlabBlock || block instanceof SlabBlock)
			addFuel(block, 150);
		else addFuel(block, 300);
	}

	public static void addAllWoods() {
		ForgeRegistries.BLOCKS.getKeys()
		.stream()
		.filter(r -> r.getNamespace().equals(Quark.MOD_ID))
		.map(ForgeRegistries.BLOCKS::getValue)
		.filter(b -> b.material == Material.WOOD)
		.forEach(FuelHandler::addWood);
	}

	@SubscribeEvent
	public static void getFuel(FurnaceFuelBurnTimeEvent event) {
		Item item = event.getItemStack().getItem();
		if(fuelValues.containsKey(item))
			event.setBurnTime(fuelValues.get(item));
	}

}
