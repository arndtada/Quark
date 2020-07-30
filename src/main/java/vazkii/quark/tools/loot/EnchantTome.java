package vazkii.quark.tools.loot;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonObject;
import net.minecraft.enchantment.Enchantment;
import net.minecraft.enchantment.EnchantmentData;
import net.minecraft.item.EnchantedBookItem;
import net.minecraft.item.ItemStack;
import net.minecraft.loot.LootContext;
import net.minecraft.loot.LootFunction;
import net.minecraft.loot.LootFunctionType;
import net.minecraft.loot.conditions.ILootCondition;
import vazkii.quark.tools.module.AncientTomesModule;

import javax.annotation.Nonnull;

import static vazkii.quark.tools.module.AncientTomesModule.validEnchants;

/**
 * @author WireSegal
 * Created at 1:48 PM on 7/4/20.
 */
public class EnchantTome extends LootFunction {
    public EnchantTome(ILootCondition[] conditions) {
        super(conditions);
    }

    @Override
    @Nonnull
    public LootFunctionType func_230425_b_() {
        return AncientTomesModule.tomeEnchantType;
    }

    @Override
    @Nonnull
    public ItemStack doApply(@Nonnull ItemStack stack, LootContext context) {
        Enchantment enchantment = validEnchants.get(context.getRandom().nextInt(validEnchants.size()));
        EnchantedBookItem.addEnchantment(stack, new EnchantmentData(enchantment, enchantment.getMaxLevel()));
        return stack;
    }

    public static class Serializer extends LootFunction.Serializer<EnchantTome> {
        @Override
        @Nonnull
        public EnchantTome deserialize(@Nonnull JsonObject object, @Nonnull JsonDeserializationContext deserializationContext, @Nonnull ILootCondition[] conditionsIn) {
            return new EnchantTome(conditionsIn);
        }
    }
}
